import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../pages/LoginPage.vue";
import CreateAccountPage from "../pages/CreateAccountPage.vue";
import ForgotPassword from "../pages/ForgotPasswordPage.vue";
import LandingPage from "../pages/LandingPage.vue";
import AirtimePurchasePage from "@/pages/buy/AirtimePurchasePage.vue"
import AirtimeSuccess from "@/pages/buy/AirtimeSuccess.vue"
import TransferFundsPage from "@/pages/TransferFundsPage.vue"
import TransferSuccess from "@/pages/TransferSuccessPage.vue"
import Transactions  from "@/pages/Transactions.vue"
import Profile from "@/pages/Profile.vue"
import PayPage from "@/pages/PayPage.vue"
import PaymentSuccess from "@/pages/PaymentSuccess.vue"

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/create-account', name: 'CreateAccount', component: CreateAccountPage },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: "/buy/airtime", name: "AirtimePurchase", component: AirtimePurchasePage},
  { path: "/buy/airtime/success", name: "AirtimeSuccess",component: AirtimeSuccess },
  { path: "/transfer", name: "TransferFunds", component: TransferFundsPage },
  { path: "/transfer-success", name: "TransferSuccess", component: TransferSuccess },
  { path: '/home', name: 'Home', component: LandingPage },
  { path: '/transact', name: 'Transact', component: Transactions },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/pay', name: 'Pay', component: PayPage },
  { path: '/pay/success', name: 'PaymentSuccess', component: PaymentSuccess }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
