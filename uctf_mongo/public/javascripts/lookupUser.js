(function () {
	'use strict';

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const form = document.querySelector('.userlookup');
	const table = document.querySelector('.tablebody');


	// Loop over them and prevent submission
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        return;
        } 

        table.innerHTML = "";

        fetch(`/lookup/${form.username.value}`)
            .then(res => res.json())
            .then(users => {
                users.forEach(user => {
                    table.insertAdjacentHTML('beforeEnd', `
                                    <tr>
                                        <th scope="row">${user.username}</th>
                                        <td>${user.uid}</td>
                                        <td>${user.role}</td>
                                    </tr>
                    `);
                });
            });

        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
    }, false);
})();