<?php
$flag = 'UCTF{7h3_m1551n6_l4k3}';

session_start();

if ($_SESSION['count'] > 320) {
    die('you have already got your flag, why are you still trying? here just leave us alone: ' . $flag);
}

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

$captcha_code = substr(md5(random_bytes(64)), 0, 6);
$image = imagecreatetruecolor(168, 37);
$captcha_bg = imagecolorallocate($image, 247, 174, 71);
imagefill($image, 0, 0, $captcha_bg);
$captcha_text_color = imagecolorallocate($image, 0, 0, 0);
imagestring($image, 5, 55, 10, $captcha_code, $captcha_text_color);
ob_start();
imagepng($image);
$imageData = ob_get_clean();
imagedestroy($image);

$_SESSION['captcha'] = $captcha_code;

$solved_captchas = $_SESSION['count'] ?? 0;

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>UCTF captcha1</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <main>
        <h4>
            We love captchas, so you should too! solve 300 of them! haha!
        </h4>
        <?php if ($solved_captchas >= 300) { ?>
            <h4>
                You have done it! there you go <?php echo $flag ?>
            </h4>
        <?php } else { ?>
            <h4>
                You have solved <?php echo $solved_captchas ?> number of captchas <?php echo (300 - $solved_captchas) ?> more to go!
            </h4>
        <?php } ?>
        <?php if ($_SERVER['REQUEST_METHOD'] == 'POST') { ?>
            <div><?php echo ($error ?? '') ?></div>
        <?php } ?>
        <form action="" method='post'>
            <img src="data:image/png;base64,<?= base64_encode($imageData); ?>" alt="Generated Image">
            <input type='text' name='captcha' placeholder='enter captcha'>
            <button type='submit'>Submit</button>
        </form>
    </main>
</body>

</html>
