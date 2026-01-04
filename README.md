# 💳 Razorpay Payment Gateway

A complete e-commerce payment gateway built with **Spring Boot** and **Razorpay SDK**. Features a premium checkout UI with glassmorphism design and secure payment verification.

![Checkout Page](Images/Screenshot%202026-01-04%20171828.png)

---

## ✨ Features

- 🔐 **Secure Payments** - HMAC SHA256 signature verification
- 🎨 **Premium UI** - Glassmorphism dark mode checkout page
- 📱 **Responsive Design** - Works on all devices
- ⚡ **REST APIs** - Easy integration with any frontend
- 🧪 **Test Mode Ready** - Supports Razorpay test credentials

---

## 🛠️ Tech Stack

| Technology | Version |
|------------|---------|
| Java | 17+ |
| Spring Boot | 3.2.1 |
| Razorpay SDK | 1.4.8 |
| Lombok | Latest |

---

## 📁 Project Structure

```
├── pom.xml
├── src/main/
│   ├── java/com/ecommerce/payment/
│   │   ├── PaymentGatewayApplication.java
│   │   ├── config/
│   │   │   └── RazorpayConfig.java
│   │   ├── controller/
│   │   │   └── PaymentController.java
│   │   ├── model/
│   │   │   ├── OrderRequest.java
│   │   │   ├── OrderResponse.java
│   │   │   ├── PaymentResponse.java
│   │   │   └── PaymentVerificationRequest.java
│   │   └── service/
│   │       └── PaymentService.java
│   └── resources/
│       ├── application.properties
│       └── static/
│           └── checkout.html
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Razorpay Account ([Sign up here](https://dashboard.razorpay.com/signup))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/razorpay-payment-gateway.git
   cd razorpay-payment-gateway
   ```

2. **Configure Razorpay API Keys**
   
   Edit `src/main/resources/application.properties`:
   ```properties
   razorpay.key.id=rzp_test_YOUR_KEY_ID
   razorpay.key.secret=YOUR_KEY_SECRET
   ```

3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Open checkout page**
   
   Navigate to `http://localhost:8080/checkout.html`

---

## 📸 Screenshots

### Checkout Page
![Checkout Form](Images/Screenshot%202026-01-04%20171841.png)

### Razorpay Payment Popup
![Payment Options](Images/Screenshot%202026-01-04%20171919.png)

### UPI Payment
![UPI Payment](Images/Screenshot%202026-01-04%20171925.png)

### Payment Processing
![Processing](Images/Screenshot%202026-01-04%20171935.png)

### Payment Success
![Success](Images/Screenshot%202026-01-04%20171945.png)

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payment/create-order` | POST | Create a new Razorpay order |
| `/api/payment/verify` | POST | Verify payment signature |
| `/api/payment/health` | GET | Health check |

### Create Order Request

```json
{
  "amount": 50000,
  "currency": "INR",
  "receipt": "order_123",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+919876543210"
}
```

### Create Order Response

```json
{
  "orderId": "order_ABC123",
  "amount": 50000,
  "currency": "INR",
  "key": "rzp_test_xxx",
  "receipt": "order_123",
  "status": "created"
}
```

---

## 🧪 Test Credentials

Use these credentials in Razorpay test mode:

| Method | Credentials |
|--------|-------------|
| **UPI** | `success@razorpay` |
| **Netbanking** | Any bank → Password: `pass` |
| **Wallet** | Any wallet → Click "Success" |
| **Card** | `5267 3181 8797 5449` |

---

## 🔒 Security

- Payment signature verification using HMAC SHA256
- API keys stored in configuration (use environment variables in production)
- Input validation on all endpoints
- CORS enabled for frontend integration

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 📧 Contact

For support, contact the development team or raise an issue on GitHub.
