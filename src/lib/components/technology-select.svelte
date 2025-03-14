<script lang="ts">
	import { selected_technologies_store } from '$lib/stores.svelte';

	let { technologies } = $props<{
		technologies: { id: number; name: string }[];
	}>();

	let input_focused = $state(false);
	let search_query = $state('');
	let selected_items = $state<{ id: number; name: string }[]>([]);
	
	let filtered_technologies = $derived.by(() => {
		if (!search_query) return technologies;
		return technologies.filter(tech =>
			tech.name.toLowerCase().includes(search_query.toLowerCase()),
		);
	});

	const handle_focus = () => (input_focused = true);
	const handle_blur = () => {
		setTimeout(() => {
			input_focused = false;
		}, 200);
	};

	let focused_index = $state(-1);

	const add_technology = (technology: {
		id: number;
		name: string;
	}) => {
		selected_items = [...selected_items, technology].filter(
			(item, index, self) =>
				index === self.findIndex(t => t.id === item.id),
		);
		focused_index = -1;
		$selected_technologies_store = selected_items;
	};

	const remove_technology = (id: number) => {
		selected_items = selected_items.filter(item => item.id !== id);
		$selected_technologies_store = selected_items;
	};

	const key_handlers = {
		ArrowDown: () => {
			focused_index = Math.min(
				focused_index + 1,
				filtered_technologies.length - 1,
			);
		},
		ArrowUp: () => {
			focused_index = Math.max(focused_index - 1, 0);
		},
		Enter: () => {
			if (filtered_technologies[focused_index]) {
				add_technology(filtered_technologies[focused_index]);
			}
		},
	};

	const handle_keydown = (event: KeyboardEvent) => {
		if (!input_focused) return;

		const handler =
			key_handlers[event.key as keyof typeof key_handlers];
		if (handler) {
			handler();
		}
	};
</script>

<!-- when clicked into show list of items -->
<div
	class="relative block min-w-52 max-w-xs rounded-btn border border-primary p-2 align-top"
>
	<!-- tags displayed -->
	<div class="flex flex-wrap place-items-center">
		{#each selected_items as item, index}
			<div draggable="true" class="" style="">
				<div
					class="badge badge-primary mb-0 mr-1 flex justify-between"
				>
					<span class="mb-1 mt-1 flex-grow pr-1">{item.name}</span>
					<button
						class="cursor-pointer pb-2 text-xs hover:text-warning"
						onclick={() => remove_technology(item.id)}
						tabindex="0"
					>
						&times;
					</button>
				</div>
			</div>
		{/each}
		<!-- input for the next item selection -->
		<input
			type="text"
			class="w-20 bg-base-100 outline-0"
			id=""
			autocomplete="off"
			tabindex="0"
			bind:value={search_query}
			onfocus={handle_focus}
			onblur={handle_blur}
			on:keydown={handle_keydown}
		/>
		<!-- clear currnet selection -->
		{#if search_query.length > 0}
			<span class="">&times;</span>
		{/if}
	</div>
	<!-- list of available items -->
	{#if input_focused}
		<div
			class="relative max-h-56 w-full overflow-auto"
			style="top:   0px;"
		>
			{#each filtered_technologies as technology, index}
				<button
					class="w-full text-left hover:bg-secondary hover:text-secondary-content {index ===
					focused_index
						? 'bg-secondary text-secondary-content'
						: ''} {selected_items.some(
						item => item.id === technology.id,
					)
						? 'bg-secondary text-secondary-content'
						: ''}"
					on:click={() => add_technology(technology)}
					on:keydown={handle_keydown}
					tabindex={index === focused_index ? 0 : -1}
				>
					{technology.name}
				</button>
			{/each}
		</div>
	{/if}
</div>
