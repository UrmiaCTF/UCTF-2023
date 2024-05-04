import { BrowserProvider, ethers } from 'ethers';
import './style.css'

const ABI = [{"inputs":[{"internalType":"uint256","name":"initialSupply","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"createLendingPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"ctfToken","outputs":[{"internalType":"contract CTFToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"isSolved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"pools","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];
const ADDRESS = '0x6E2Fb54893644A888832Cc9C9Fbe4144Cc809Ca3';

const errors = document.getElementById('errors');

const connect_button = document.getElementById("connect-button");
connect_button.addEventListener("click", () => {
    load_accounts();
});

const disconnect_button = document.getElementById("disconnect-button");
disconnect_button.addEventListener("click", () => {
    localStorage.removeItem('address');
    document.getElementById('not-connected').style.display = '';
    document.getElementById('connected').style.display = "none";
    document.getElementById('wallet-address').textContent = "";
});
const deploy_contract_button = document.getElementById('deploy-contract');
deploy_contract_button.addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        if (localStorage.getItem('address') == 'undefined') {
            errors.textContent = 'you need to connect your wallet beforehand';
            console.error('you need to connect beforehand');
        }

        const accounts = localStorage.getItem('address');

        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(ADDRESS, ABI, signer)

        try {
            await contract.createLendingPool.call();
                
        } catch (e) {
            console.error(e);
            errors.textContent = 'Most probably you have already created the lending pool';
        }

        try {
            const address = await contract.pools(accounts);
            
            document.getElementById('deploy-contract-address').textContent = address;
        } catch (e) {
            console.error(e);
            errors.textContent = 'Contact UCTF support team https://t.me/uctf_support_bot';
        }
    }
});

const flag_section = document.getElementById('flag');
const get_flag_button = document.getElementById('isSolved');
get_flag_button.addEventListener('click', async () => {
    fetch(document.URL, {
        method: 'post',
        body: JSON.stringify({
            address: localStorage.getItem('address')
        })
    }).then(async (data) => {
        data.json().then((json) => {
            if ( typeof json.exception != 'undefined') {
                    throw json.exception;
                }
            if (json.isSolved == true) {
                flag_section.textContent = json.flag;
            } else {
                flag_section.textContent = "Nope, you have not solved the challenge yet";
            }
        }).catch((e) => {
            console.error(e);
            errors.textContent += "something unexpected happend, please contct UCTF team. https://t.me/uctf_support_bot";
        })
    }).catch((e) => {
        console.error(e);
        errors.textContent += "something unexpected happend, please contct UCTF team. https://t.me/uctf_support_bot";
    });
})

//if user is already connected, show other 

    // If wallet exists in the localsstoarge don't run this thing. and don't show the conenct button
    //here both dot the first 2 buttons, and in a php condition, show interesting stuff if successful. and show the flag.
    

async function load_accounts() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});

            document.getElementById('not-connected').style.display = 'none';
            document.getElementById('connected').style.display = "";
            localStorage.setItem('address', accounts);
            document.getElementById('wallet-address').textContent = accounts;

            return accounts;
        } catch(e) {
            errors.textContent = 'something unexpected happend, please contct UCTF team. https://t.me/uctf_support_bot';
            console.error(e);
        }
    } else {
        errors.textContent = 'Meta mask not detected.';
        console.error('Meta mask not detected.');
    }
}

