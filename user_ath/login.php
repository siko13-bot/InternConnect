
<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user'] = [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'account_type' => $user['account_type']
        ];

        // Redirect based on account type
        switch ($user['account_type']) {
            case 'admin':
                header('Location: ../admin.html');
                break;
            case 'employer':
                header('Location: ../company.html');
                break;
            case 'student':
                header('Location: ../applicant.html');
                break;
            default:
                $_SESSION['error'] = 'Invalid account type';
                header('Location: ../login.php');
        }
        exit;
    } else {
        $_SESSION['error'] = 'Invalid email or password';
        header('Location: ../login.php');
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=\, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="auth_style.css">
</head>
<body>
    <div class="container form-container">
        <div class="wrapper">
            <div class="form-header">
                <h1>Login Form</h1>
                <!-- Add error message display -->
<?php if (isset($_SESSION['error'])): ?>
    <p style="color: red;"><?= $_SESSION['error'] ?></p>
    <?php unset($_SESSION['error']); ?>
<?php endif; ?>
            </div>
            <form action="login.php" method="POST">
                <input type="email" name="email" id="email" placeholder="Enter email...">
                <input type="password" name="password" id="password" placeholder="Enter password..." required>
                <button type="submit">Login</button>
                <p>New user? <a href="registration.php">Create Account</a></p>
            </form>
        </div>
    </div>
</body>
</html>