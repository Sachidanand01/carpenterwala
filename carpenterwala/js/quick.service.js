<script>

// If user clicks anywhere outside of the modal, Modal will close

var modal = document.getElementById('modal-wrapper');
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



</script>

<script>
let qbtnsubmit = document.querySelector('#ppbtn');
let cbtnsubmit = document.query.Selector('#btnContactUs');

qbtnsubmit.addEventListner('click', () => qbtnsubmit.style.backgroundColor='#4cae4c')
cbtnsubmit.addEventListner('click', () => cbtnsubmit.style.backgroundColor='#4cae4c')

</script>