<script>
	import { ws } from "../webSocket";
	import { roomId } from "../stores";

	export let showModal;

	let dialog;
    let name;

	const previousName = localStorage.getItem("previousName");
	if (previousName != null) name = previousName;

	$: if (dialog && showModal) dialog.showModal();

	let errorMessage;

    function setName() {
		if(!name) {
			errorMessage = "Você deve preencher o campo nome";
			return
		} else if(name.length > 50) {
			errorMessage = "Seu nome deve conter no máximo 50 caracteres";
			return
		}

		localStorage.setItem("previousName", name);
		ws.send(JSON.stringify({ type: "setName", name: name, roomId: $roomId }));
		dialog.close();
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
>
	<div on:click|stopPropagation >
		<label for="name">Nome:</label>
		<input type="text" placeholder="Digite seu nome" id="name" bind:value={name}>
		{#if errorMessage}
			<p id="errorMessage">{errorMessage}</p>
		{/if}
        <hr />
        <!-- svelte-ignore a11y-autofocus -->
		<div id="buttons">
        	<button on:click={setName} class="btnPrimary">Confirmar</button>
		</div>
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
		margin-top: 20px;
		font-size: 1.2em;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.856);
	}

	dialog > div {
		padding: 1em;
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	#buttons {
		display: flex;
		justify-content: flex-end;
		gap: 5px;
	}

	#errorMessage {
		font-size: 0.8em;
		color: #f0506e;
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
