
<template id="modal">
 <div class="modal">
	<div class="modal-window">
	  <p>Êtes-vous certain de vouloir supprimer l'utilisateur <strong>{{ user.name }}</strong> ?</p>
	  <div class="actions">
		 <button class="cancel" @click="onCancel">Annuler</button>
		 <button class="confirm" @click="onConfirm">Confirmer</button>
	  </div>
	</div>
 </div>
</template>