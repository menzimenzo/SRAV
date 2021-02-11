export const parseErrorMessage = error => {
    let message = error || 'Un problème est survenu.'
    if (message === 'Request failed with status code 502') {
        message = 'Une erreur serveur est survenue.'
    } else if (message === 'Request failed with status code 413') {
        message = MAX_FILE_SIZE_MESSAGE
    } else if (message === 'Request failed with status code 400') {
        message = 'Un problème est survenu lors de l\'envoi de la requête au serveur.'
    } else if (message === 'Request failed with status code 404') {
        message = 'La ressource demandé n\'a pas été trouvée.'
    }
    return message
}

export const formatEmail = email => email && email.trim().toLowerCase()
