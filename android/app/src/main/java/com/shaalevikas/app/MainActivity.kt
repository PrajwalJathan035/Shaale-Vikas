package com.shaalevikas.app

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.lifecycleScope
import com.shaalevikas.app.data.*
import com.shaalevikas.app.ui.*
import com.shaalevikas.app.ui.theme.ShaaleVikasTheme
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    private lateinit var database: ShaaleVikasDatabase

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        database = ShaaleVikasDatabase.getDatabase(this)

        // Seed mock data if DB has no needs
        lifecycleScope.launch {
            val hasNeeds = database.needDao().getAllNeedsFlow().firstOrNull()?.isNotEmpty() == true
            if (!hasNeeds) {
                ShaaleVikasDatabase.prepopulate(database)
            }
        }

        setContent {
            ShaaleVikasTheme {
                var currentScreen by remember { mutableStateOf(AppScreen.WELCOME) }
                var currentUser by remember { mutableStateOf<User?>(null) }
                var selectedNeed by remember { mutableStateOf<Need?>(null) }

                // Pledging active parameters
                var amountToPledge by remember { mutableStateOf(0.0) }
                var pledgeMethod by remember { mutableStateOf("") }
                var pledgeDonorName by remember { mutableStateOf("") }

                // Live dynamic flows matching React Context
                val needsFlowState = database.needDao().getAllNeedsFlow().collectAsState(initial = emptyList())
                val pledgesFlowState = database.pledgeDao().getAllPledgesFlow().collectAsState(initial = emptyList())

                val activeNeeds = needsFlowState.value
                val allPledges = pledgesFlowState.value

                Scaffold(
                    modifier = Modifier.fillMaxSize()
                ) { innerPadding ->
                    Box(modifier = Modifier.padding(innerPadding)) {
                        // Navigation router with Compose slide anim panels
                        AnimatedContent(
                            targetState = currentScreen,
                            transitionSpec = {
                                slideInHorizontally { width -> width } + fadeIn() togetherWith
                                slideOutHorizontally { width -> -width } + fadeOut()
                            },
                            label = "Main Screen Router"
                        ) { screen ->
                            when (screen) {
                                AppScreen.WELCOME -> {
                                    WelcomeScreen(
                                        onNavigate = { currentScreen = it },
                                        onGuestPath = { role ->
                                            currentUser = User(
                                                uid = "guest_uid",
                                                name = "Guest Supporter",
                                                email = "guest@shaalevikas.com",
                                                role = role
                                            )
                                            currentScreen = if (role == "admin") AppScreen.ADMIN_DASHBOARD else AppScreen.ALUMNI_DASHBOARD
                                        }
                                    )
                                }
                                AppScreen.CHOOSE_PATH -> {
                                    ChoosePathScreen(
                                        onBack = { currentScreen = AppScreen.WELCOME },
                                        onSelectRole = { role ->
                                            currentUser = User(
                                                uid = "guest_uid",
                                                name = "Guest Supporter",
                                                email = "guest@shaalevikas.com",
                                                role = role
                                            )
                                            currentScreen = if (role == "admin") AppScreen.ADMIN_DASHBOARD else AppScreen.ALUMNI_DASHBOARD
                                        }
                                    )
                                }
                                AppScreen.LOGIN -> {
                                    LoginScreen(
                                        onBack = { currentScreen = AppScreen.WELCOME },
                                        onForgotPassword = { currentScreen = AppScreen.FORGOT_PASSWORD },
                                        onRegisterRedirect = { currentScreen = AppScreen.REGISTER },
                                        onLoginSuccess = { email, password, role ->
                                            lifecycleScope.launch {
                                                val existing = database.userDao().getUserByEmail(email)
                                                if (existing != null) {
                                                    currentUser = existing
                                                } else {
                                                    // Auto-provision user locally
                                                    val provisioned = User(
                                                        uid = "u_${System.currentTimeMillis()}",
                                                        name = if (email.contains("@")) email.substringBefore("@").replaceFirstChar { it.uppercase() } else "User Partner",
                                                        email = email,
                                                        password = password,
                                                        role = role
                                                    )
                                                    database.userDao().insertUser(provisioned)
                                                    FirebaseService.syncUser(provisioned) // real-time backup sync
                                                    currentUser = provisioned
                                                }
                                                currentScreen = if (role == "admin" || email == "headmaster@shaalevikas.com") {
                                                    AppScreen.ADMIN_DASHBOARD
                                                } else {
                                                    AppScreen.ALUMNI_DASHBOARD
                                                }
                                            }
                                        }
                                    )
                                }
                                AppScreen.REGISTER -> {
                                    RegisterScreen(
                                        onBackClick = { currentScreen = AppScreen.WELCOME },
                                        onRegisterSuccess = { name, email, phone, role, school, batch, password ->
                                            lifecycleScope.launch {
                                                val created = User(
                                                    uid = "u_${System.currentTimeMillis()}",
                                                    name = name,
                                                    email = email,
                                                    phone = phone,
                                                    orgName = school,
                                                    batch = batch,
                                                    role = role,
                                                    password = password
                                                )
                                                database.userDao().insertUser(created)
                                                FirebaseService.syncUser(created)
                                                currentUser = created
                                                currentScreen = if (role == "admin") AppScreen.ADMIN_DASHBOARD else AppScreen.ALUMNI_DASHBOARD
                                            }
                                        }
                                    )
                                }
                                AppScreen.FORGOT_PASSWORD -> {
                                    ForgotPasswordScreen(onBackClick = { currentScreen = AppScreen.LOGIN })
                                }
                                AppScreen.ALUMNI_DASHBOARD -> {
                                    currentUser?.let { user ->
                                        AlumniDashboard(
                                            user = user,
                                            needs = activeNeeds,
                                            pledges = allPledges,
                                            onNeedClick = { need ->
                                                selectedNeed = need
                                                currentScreen = AppScreen.NEED_DETAIL
                                            },
                                            onNavigate = { currentScreen = it }
                                        )
                                    } ?: run { currentScreen = AppScreen.WELCOME }
                                }
                                AppScreen.ADMIN_DASHBOARD -> {
                                    currentUser?.let { user ->
                                        AdminDashboard(
                                            user = user,
                                            needs = activeNeeds,
                                            pledges = allPledges,
                                            onNeedClick = { need ->
                                                selectedNeed = need
                                                currentScreen = AppScreen.NEED_DETAIL
                                            },
                                            onAddNeedClick = { currentScreen = AppScreen.ADMIN_ADD_NEED },
                                            onLogout = {
                                                currentUser = null
                                                currentScreen = AppScreen.WELCOME
                                            }
                                        )
                                    } ?: run { currentScreen = AppScreen.WELCOME }
                                }
                                AppScreen.ACTIVE_NEEDS -> {
                                    ActiveNeedsScreen(
                                        needs = activeNeeds,
                                        onNeedClick = { need ->
                                            selectedNeed = need
                                            currentScreen = AppScreen.NEED_DETAIL
                                        }
                                    )
                                }
                                AppScreen.NEED_DETAIL -> {
                                    selectedNeed?.let { need ->
                                        NeedDetailScreen(
                                            need = need,
                                            isAdmin = currentUser?.role == "admin",
                                            onBack = {
                                                currentScreen = if (currentUser?.role == "admin") AppScreen.ADMIN_DASHBOARD else AppScreen.ALUMNI_DASHBOARD
                                            },
                                            onPledgeClick = {
                                                pledgeDonorName = currentUser?.name ?: "Support Challenger"
                                                currentScreen = AppScreen.PLEDGE
                                            }
                                        )
                                    }
                                }
                                AppScreen.PLEDGE -> {
                                    selectedNeed?.let { need ->
                                        PledgeScreen(
                                            need = need,
                                            initialDonorName = pledgeDonorName,
                                            onBack = { currentScreen = AppScreen.NEED_DETAIL },
                                            onProceed = { amount, method, name ->
                                                amountToPledge = amount
                                                pledgeMethod = method
                                                pledgeDonorName = name
                                                currentScreen = AppScreen.FAKE_PAYMENT
                                            }
                                        )
                                    }
                                }
                                AppScreen.FAKE_PAYMENT -> {
                                    selectedNeed?.let { need ->
                                        FakePaymentScreen(
                                            need = need,
                                            amount = amountToPledge,
                                            method = pledgeMethod,
                                            onBack = { currentScreen = AppScreen.PLEDGE },
                                            onPaymentSuccess = { currentScreen = AppScreen.CONFIRM_PLEDGE }
                                        )
                                    }
                                }
                                AppScreen.CONFIRM_PLEDGE -> {
                                    selectedNeed?.let { need ->
                                        ConfirmPledgeScreen(
                                            need = need,
                                            amount = amountToPledge,
                                            method = pledgeMethod,
                                            donorName = pledgeDonorName,
                                            onBack = { currentScreen = AppScreen.PLEDGE },
                                            onConfirm = {
                                                lifecycleScope.launch {
                                                    // 1. Commit Donor Pledge Transaction to database offline-first
                                                    val donorTxn = Donor(
                                                        id = "p_${System.currentTimeMillis()}",
                                                        name = pledgeDonorName,
                                                        email = currentUser?.email ?: "guest@example.com",
                                                        pledgeAmount = amountToPledge,
                                                        needId = need.id,
                                                        needTitle = need.title,
                                                        paymentMethod = pledgeMethod,
                                                        transactionId = "TXN${(10000..99999).random()}"
                                                    )
                                                    database.pledgeDao().insertPledge(donorTxn)
                                                    FirebaseService.syncPledge(donorTxn) // sync online status

                                                    // 2. Refresh target Need with added pledged amount 
                                                    val updatedNeed = need.copy(
                                                        amountPledged = need.amountPledged + amountToPledge,
                                                        status = if (need.amountPledged + amountToPledge >= need.costEstimate) "Completed" else "Active"
                                                    )
                                                    database.needDao().updateNeed(updatedNeed)
                                                    FirebaseService.syncNeed(updatedNeed)

                                                    Toast.makeText(this@MainActivity, "Pledge published successfully!", Toast.LENGTH_LONG).show()
                                                    currentScreen = AppScreen.SUCCESS
                                                }
                                            }
                                        )
                                    }
                                }
                                AppScreen.SUCCESS -> {
                                    SuccessCheckoutScreen(
                                        amount = amountToPledge,
                                        onNavigateBack = {
                                            currentScreen = if (currentUser?.role == "admin") AppScreen.ADMIN_DASHBOARD else AppScreen.ALUMNI_DASHBOARD
                                        }
                                    )
                                }
                                AppScreen.HALL_OF_FAME -> {
                                    HallOfFameScreen(
                                        pledges = allPledges,
                                        onBack = { currentScreen = AppScreen.ALUMNI_DASHBOARD }
                                    )
                                }
                                AppScreen.IMPACT_GALLERY -> {
                                    ImpactGalleryScreen(
                                        needs = activeNeeds,
                                        onBack = { currentScreen = AppScreen.ALUMNI_DASHBOARD }
                                    )
                                }
                                AppScreen.ADMIN_ADD_NEED -> {
                                    AdminAddNeedScreen(
                                        onBack = { currentScreen = AppScreen.ADMIN_DASHBOARD },
                                        onSubmit = { title, desc, category, cost, priority, beforeUrl ->
                                            lifecycleScope.launch {
                                                val newNeed = Need(
                                                    id = "n_${System.currentTimeMillis()}",
                                                    title = title,
                                                    description = desc,
                                                    category = category,
                                                    costEstimate = cost,
                                                    amountPledged = 0.0,
                                                    priority = priority,
                                                    status = "Active",
                                                    beforePhotoUrl = beforeUrl
                                                )
                                                database.needDao().insertNeed(newNeed)
                                                FirebaseService.syncNeed(newNeed)
                                                Toast.makeText(this@MainActivity, "Requirement logged!", Toast.LENGTH_SHORT).show()
                                                currentScreen = AppScreen.ADMIN_DASHBOARD
                                            }
                                        }
                                    )
                                }
                                AppScreen.PROFILE -> {
                                    currentUser?.let { user ->
                                        ProfileScreen(
                                            user = user,
                                            onBack = {
                                                currentScreen = if (user.role == "admin") AppScreen.ADMIN_DASHBOARD else AppScreen.ALUMNI_DASHBOARD
                                            },
                                            onLogout = {
                                                currentUser = null
                                                currentScreen = AppScreen.WELCOME
                                            }
                                        )
                                    } ?: run { currentScreen = AppScreen.WELCOME }
                                }
                                else -> {
                                    // Fallback UI
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
