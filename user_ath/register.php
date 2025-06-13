<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $account_type = strtolower($_POST['user-type']); // Convert to lowercase

    // Validation
    if (empty($username) || empty($email) || empty($password)) {
        $_SESSION['error'] = 'All fields are required';
        header('Location: registration.php');
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error'] = 'Invalid email format';
        header('Location: registration.php');
        exit;
    }

    // Check existing email
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        $_SESSION['error'] = 'Email already registered';
        header('Location: registration.php');
        exit;
    }

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user
    try {
        $stmt = $pdo->prepare('INSERT INTO users (username, email, password, account_type) VALUES (?, ?, ?, ?)');
        $stmt->execute([$username, $email, $hashed_password, $account_type]);
        
        $_SESSION['success'] = 'Registration successful! Please login';
        header('Location: login.php');
        exit;
    } catch (PDOException $e) {
        $_SESSION['error'] = 'Registration failed: ' . $e->getMessage();
        header('Location: registration.php');
        exit;
    }
}
?>