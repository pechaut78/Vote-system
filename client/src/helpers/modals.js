function openModal(refer) {
    refer.style.display = "block"
    refer.classList.add("show")
}
function closeModal(refer) {
    refer.style.display = "none"
    refer.classList.remove("show")
}

export {openModal, closeModal}