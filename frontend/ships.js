const url = 'http://localhost:3000/ships';
function myFunction() {
    $.get(url, function (data) {

        console.log(data)
        
        for (var i = 0; i < data.length; i++) {

            document.getElementById('ships').textContent += data[i].id +
                '\n' + data[i].name + '\n' + data[i].desciption +
                '\n' + '------------' + '\n'
        }

    })

}


