<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { writable } from 'svelte/store';

	let { dev } = $props<{
		dev: {
			id: number;
			name: string;
			bio: string;
			avatar: string;
			country_id: string;
			country_name: string;
			technologies: string;
			likes: number;
		};
	}>();

	let technologies_array = dev.technologies.split(',');

	const country_code_to_flag_emoji = (
		countryCode: string,
	): string => {
		const offset = 127397;
		return (
			String.fromCodePoint(countryCode.charCodeAt(0) + offset) +
			String.fromCodePoint(countryCode.charCodeAt(1) + offset)
		);
	};

	let button_disabled = writable(false);
	let likes = writable(dev.likes || 0);

	const handle_result = (result: ActionResult) => {
		if (result.type === 'success') {
			$likes += 1;
		} else if (result.type === 'failure') {
			$button_disabled = true;
			setTimeout(() => {
				$button_disabled = false;
			}, result?.data?.time_remaining * 1000);
		}
	};
</script>

<article class="card card-compact w-auto bg-base-100 shadow-xl sm:w-60">
	<figure>
		<img src={dev.avatar} alt={dev.name} />
	</figure>
	<div class="card-body">
		<h2 class="card-title">
			{dev.name}
			<span>{country_code_to_flag_emoji(dev.country_id)}</span>
		</h2>

		<p>{dev.bio}</p>
		<div>
			{#each technologies_array as technology}
				<span
					class="badge badge-primary badge-xs mb-2 mr-2 cursor-pointer py-2"
				>
					{technology}
				</span>
			{/each}
		</div>
		<div class="card-actions justify-end">
			<form
				method="POST"
				action="/api/like?id={dev.id}"
				use:enhance={() => {
					return ({ update, result }) => {
						handle_result(result);
						update({ reset: false });
					};
				}}
				class="w-full"
			>
				<button
					class="btn btn-primary btn-block flex justify-between"
					disabled={$button_disabled}
				>
					<span> Dope &UpArrow; </span>
					<span>
						{$likes}
					</span>
				</button>
			</form>
		</div>
	</div>
</article>
