<?php
    namespace Uctf\Crypto;

    use Web3\Web3;
    use Web3\RequestManagers\HttpRequestManager;
    use Web3\Contract;
    use Web3\Providers\HttpProvider;

    include '../vendor/autoload.php';

    if($_SERVER['REQUEST_METHOD'] == 'POST') {

       $json_input = json_decode(file_get_contents('php://input'));

        if( ! isset($json_input->address) || is_null($json_input->address)) {
            echo "format your data properly";
            die();
        }

        $flag = 'UCTF{Urmia_P4radise0fIran}';
        $ABI = json_decode('[{"inputs":[{"internalType":"uint256","name":"initialSupply","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"createLendingPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"ctfToken","outputs":[{"internalType":"contract CTFToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"isSolved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"pools","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]');
        $provider = new HttpProvider(new HttpRequestManager('https://rpc-mumbai.maticvigil.com', 10));
        $contract = new Contract($provider, $ABI);

        $data = $contract
            ->at('0x6E2Fb54893644A888832Cc9C9Fbe4144Cc809Ca3')
            ->call( 
                'isSolved',
                $json_input->address,
                function ($error, $result) use ($flag){
                    header('Content-Type: application/json');
                    if ($error !== null) {
                        echo json_encode(['exception' => $error->getMessage()]);
                        die();
                    }
                    echo json_encode(['isSolved' => $result[0], 'flag' => $flag]);
                    die();
            }
        );
    }   
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lending Pool</title>
        <script type="module" defer cross origin src="assets/index.js"></script>
        <link rel="stylesheet" href="assets/index.css">
    </head>
    <body> 
        <main>
            <h4 id="errors"></h4>
            <div>
                You should have enough Matic on Polygon mumbai testnet
                Faucet: https://mumbaifaucet.com
            </div>
            <div id="not-connected">
                <br>
                <button id="connect-button">Connect Metamask</button>
            </div>
            <div id="connected" style="display: none">
                <button id="disconnect-button">Disconnect the wallet</button>
                <h3>
                    Your Wallet Address:    <div id="wallet-address"> <div>
                </h3>
                <button id="deploy-contract">Deploy Your LendingPool Contract</button>
                <h3>
                    Deployed contract's address: <div id="deploy-contract-address"></div>
                </h3>
                <button id="isSolved">Get Flag</button>
                <h3>
                    Your flag is going to appear here: <div id="flag"></div>
                </h3>

            </div>
        </main>
        <script>
            if (localStorage.getItem('address') !== null) {
               document.getElementById('not-connected').style.display = 'none';
               document.getElementById('connected').style.display = "";
               document.getElementById('wallet-address').textContent = localStorage.getItem('address');
            }
        </script>
    </body>
</html>
