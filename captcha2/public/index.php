<?php
$pictures = [
    'rabbit' => '6D0EBBBDCE32474DB8141D23D2C01BD9628D6E5F.jpeg',
    'dog' => 'E49512524F47B4138D850C9D9D85972927281DA0.jpeg',
    'cat' => '9D989E8D27DC9E0EC3389FC855F142C3D40F0C50.jpeg',
    'bear' => '09F5EDEB4F5B2A4E4364F6B654682C6758A3FA16.jpeg',
    'fox' => 'FF0F0A8B656F0B44C26933ACD2E367B6C1211290.jpeg',
    'eagle' => 'C29E4D9C8824409119EAA8BA182051B89121E663.jpeg',
    'snake' => '148627088915C721CCEBB4C611B859031037E6AD.jpeg',
    'horse' => '091B5035885C00170FEC9ECF24224933E3DE3FCC.jpeg',
    'penguin' => '73335C221018B95C013FF3F074BD9E8550E8D48E.jpeg',
    'mouse' => '9E05E6832CAFFCA519722B608570B8FF4935B94D.jpeg',
    'duck' => '5ECE240085B9AD85B64896082E3761C54EF581DE.jpeg',
];

$flag = 'UCTF{Arm3n1an_m0uflon}';

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (! isset($_SESSION['captcha'])) {
        die('trying to brute POST ? nah man it ain\'t feasable!');
    }
    if ($_SESSION['captcha'] == $_POST['captcha']) {
        if (isset($_SESSION['count'])) {
            $_SESSION['count'] += 1;
        } else {
            $_SESSION['count'] = 1;
        }
    } else {
        $error = 'that ain\'t right';
    }
}

[$first, $second] = array_rand($pictures, 2);

$captcha_code = $first . '-' . $second;

$_SESSION['captcha'] = $captcha_code;

$solved_captchas = $_SESSION['count'] ?? 0;
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>UCTF captcha2</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <main>
        <h4>
            Weeelp us!
        </h4>
        <h3>
            You should enter the captcha in following format: snake-horse
        </h3>
        <?php if ($solved_captchas >= 100) { ?>
            <h4>
                You have done it! there you go <?php echo $flag ?>
            </h4>
        <?php } else { ?>
            <h4>
                You have solved <?php echo $solved_captchas ?> number of captchas <?php echo (100 - $solved_captchas) ?> more to go!
            </h4>
        <?php } ?>
        <?php if ($_SERVER['REQUEST_METHOD'] == 'POST') { ?>
            <h4><?php echo ($error ?? '') ?></h4>
        <?php } ?>
        <form action="" method='post'>
            <div>
                <img src="<?php echo $pictures[$first] ?>">
                <img src="<?php echo $pictures[$second] ?>">
            </div>
            <input type='text' name='captcha' placeholder="enter captcha">
            <button type='submit'>Submit</button>
        </form>
    </main>
</body>

</html>
