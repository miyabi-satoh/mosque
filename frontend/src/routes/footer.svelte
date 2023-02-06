<script lang="ts">
	import { Footer, FooterCopyright, FooterLink, FooterLinkGroup } from 'flowbite-svelte';
</script>

<div class="lg:pl-64 border-t border-gray-200 dark:border-gray-700 mt-6 lg:mt-8">
	<Footer footerType="custom" customClass="py-6 lg:py-8 px-4 lg:px-8 dark:bg-gray-900">
		<div class="sm:flex sm:items-center sm:justify-between">
			<FooterCopyright href="/" by="miyabi-satoh" year={2023} />
			<FooterLinkGroup
				ulClass="flex flex-wrap items-center mt-3 sm:mt-0 text-sm text-gray-500 dark:text-gray-400"
			>
				<FooterLink href="/about">About</FooterLink>
			</FooterLinkGroup>
		</div>
	</Footer>
</div>
