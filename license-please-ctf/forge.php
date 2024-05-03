<?php

use Ecc\CurveP256;
use Ecc\Signature;

require_once 'src/inc/ecc/point.php';
require_once 'src/inc/ecc/curve.php';

require_once 'src/inc/license.php';

$options = getopt('h', [
    'help',
    'l1:',
    'l2:',
]);

$l1 = $options['l1'] ?? null;
$l2 = $options['l2'] ?? null;

if (isset($options['h']) || ($l1 === null && $l2 === null)) {
    die("Usage: forge.php --l1 <license 1> --l2 <license 2>\n");
}

$lic1 = json_decode($l1, true, 512, JSON_THROW_ON_ERROR);
$lic2 = json_decode($l2, true, 512, JSON_THROW_ON_ERROR);

$sig1 = Signature::import($lic1['signature']);
$sig2 = Signature::import($lic2['signature']);

$h1 = gmp_init(hash('sha256', $lic1['user'] . $lic1['expire'] . var_export($lic1['demo'], true)), 16);
$h2 = gmp_init(hash('sha256', $lic2['user'] . $lic2['expire'] . var_export($lic2['demo'], true)), 16);

$curve = CurveP256::getInstance();

/* Recover private key (see https://asecuritysite.com/encryption/ecd5) */
$val_inv = gmp_invert(gmp_mul($sig1->r, gmp_sub($sig1->s, $sig2->s)), $curve->n());
$privkey = gmp_mod(gmp_mul(gmp_sub(gmp_mul($sig2->s, $h1), gmp_mul($sig1->s, $h2)), $val_inv), $curve->n());

echo 'Recovered private key: ' . gmp_strval($privkey, 62) . "\n";

/* Forge new license */
$forged_lic = License::new('pwned', '+1 year', false, $privkey, $curve);

echo 'Forged licesne: ' . $forged_lic . "\n";
