document.addEventListener('DOMContentLoaded', function() {
    function formatDate(date) {
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    }

    document.getElementById('formulario-registro').addEventListener('submit', function(event) {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const fechanac = document.getElementById('fecha-nac').value;
        const emailIngresado = document.getElementById('email').value;
        const cargo = document.getElementById('cargo').value;
        const fechacontrata = document.getElementById('fecha-contrata').value;

        // Verificar si el correo electrónico ya está registrado
        const usuarioRegistrado = Array.from(document.querySelectorAll('#user-list .user-email'))
                               .some(userEmail => userEmail.textContent === emailIngresado);

        if (usuarioRegistrado) {
            alert('El correo electrónico ya está registrado.');
            return;
        }

        const fechaNacimientoParts = fechanac.split('-');
        const fechaNacimiento = new Date(Date.UTC(
            fechaNacimientoParts[0],
            fechaNacimientoParts[1] - 1,
            fechaNacimientoParts[2]
        ));

        const fechaContratacionParts = fechacontrata.split('-');
        const fechaContratacion = new Date(Date.UTC(
            fechaContratacionParts[0],
            fechaContratacionParts[1] - 1,
            fechaContratacionParts[2]
        ));

        const edadContratacion = fechaContratacion.getUTCFullYear() - fechaNacimiento.getUTCFullYear();
        const diferenciaMeses = fechaContratacion.getUTCMonth() - fechaNacimiento.getUTCMonth();
        const diferenciaDias = fechaContratacion.getUTCDate() - fechaNacimiento.getUTCDate();

        if (edadContratacion < 18 || (edadContratacion === 18 && (diferenciaMeses < 0 || (diferenciaMeses === 0 && diferenciaDias < 0)))) {
            alert('El trabajador debe tener al menos 18 años al momento de ingresar.');
            return;
        }

        document.getElementById('nombreModal').textContent = `${nombre} ${apellido}`;
        document.getElementById('emailModal').textContent = emailIngresado;
        document.getElementById('cargoModal').textContent = cargo;
        document.getElementById('fechacontrataModal').textContent = formatDate(fechaContratacion);

        $('#confirmationModal').modal('show');
    });

    document.getElementById('confirmButton').addEventListener('click', function() {
        const nombre = document.getElementById('nombreModal').textContent.split(' ')[0];
        const apellido = document.getElementById('nombreModal').textContent.split(' ')[1];
        const email = document.getElementById('emailModal').textContent;
        const cargo = document.getElementById('cargoModal').textContent;
        const fechacontrata = document.getElementById('fechacontrataModal').textContent;

        const userCard = document.createElement('div');
        userCard.className = 'col-lg-3 col-md-4 col-sm-6 col-12 mb-4 user-card';
        userCard.innerHTML = `
            <p><strong>${nombre} ${apellido}</strong></p>
            <p class="user-email">${email}</p>
            <p>${cargo}</p>
            <p>${fechacontrata}</p>
            <button class="btn btn-danger btn-sm">Eliminar Registro</button>
        `;

        document.getElementById('user-list').appendChild(userCard);

        userCard.querySelector('button').addEventListener('click', function() {
            userCard.remove();
        });

        document.getElementById('formulario-registro').reset();
        $('#confirmationModal').modal('hide');
    });
});
