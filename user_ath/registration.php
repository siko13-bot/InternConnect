
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=\, initial-scale=1.0">
    <title>Registration</title>
    <link rel="stylesheet" href="auth_style.css">
    
</head>
<body>
    <div class="container form-container">
        <div class="wrapper">
            <div class="form-header">
                <h1>Registration Form</h1>
                <!-- Add error/success messages -->
<?php if (isset($_SESSION['error'])): ?>
    <p style="color: red;"><?= $_SESSION['error'] ?></p>
    <?php unset($_SESSION['error']); ?>
<?php endif; ?>
<?php if (isset($_SESSION['success'])): ?>
    <p style="color: green;"><?= $_SESSION['success'] ?></p>
    <?php unset($_SESSION['success']); ?>
<?php endif; ?>
            </div>
            <form action="register.php" method="POST">
                <input type="text" name="username" id="username" placeholder="Enter Username...">
                <input type="email" name="email" id="email" placeholder="Enter email...">
                <input type="password" name="password" id="password" placeholder="Enter password..." required>
                <select name="user-type" id="user-type" required>
                    <option value="">Select Account Type</option>
                    <option value="student">Student</option>
                    <option value="employer">Employer</option>
                    <option value="Admin">Admin</option>
                </select>
                <button type="submit">Register</button>
                <p>Already have an account?  <a href="login.php">Login here</a></p>
            </form>
        </div>
    </div>
</body>
</html>