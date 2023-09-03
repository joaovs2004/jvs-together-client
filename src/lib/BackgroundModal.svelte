<script>
    import { backgroundImageUrl } from "../stores";

	export let showModal;

	let dialog;
    let imageUrl;

	$: if (dialog && showModal) dialog.showModal();

	const previousBackgroundImage = localStorage.getItem("backgroundImageUrl");

	if(previousBackgroundImage) {
		backgroundImageUrl.set(previousBackgroundImage);
		imageUrl = previousBackgroundImage;
	}

	let errorMessage;

    async function setBackgroundImage() {
        if(imageUrl) {
            if(imageUrl.includes("cc/w/")) {
                const url = new URL(imageUrl);
                const id = url.pathname.substring(3);

                imageUrl = await fetch('https://corsproxy.io/?' + encodeURIComponent('https://wallhaven.cc/api/v1/w/' + id))
					.then(value => value.json())
					.then(data => {
						return data.data.path;
					});
            }

            localStorage.setItem("backgroundImageUrl", imageUrl);
            backgroundImageUrl.set(imageUrl);
            dialog.close();
        }
    }

    function resetBackgroundImage() {
        localStorage.removeItem("backgroundImageUrl");
        backgroundImageUrl.set(null);
		imageUrl = "";
        dialog.close();
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
>
	<div on:click|stopPropagation >
		<label for="name">Link da imagem:</label>
		<input type="text" placeholder="Digite o link" id="name" bind:value={imageUrl}>
		{#if errorMessage}
			<p id="errorMessage">{errorMessage}</p>
		{/if}
        <hr />
        <!-- svelte-ignore a11y-autofocus -->
		<div id="buttons">
            <button on:click={resetBackgroundImage}>
				{imageUrl ? "Resetar" : "Fechar"}
			</button>
        	<button on:click={setBackgroundImage} class="btnPrimary">Confirmar</button>
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
