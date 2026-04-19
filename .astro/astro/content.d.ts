declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"docs": {
"advanced/api-sdks.md": {
	id: "advanced/api-sdks.md";
  slug: "advanced/api-sdks";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"advanced/gotchas.md": {
	id: "advanced/gotchas.md";
  slug: "advanced/gotchas";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"advanced/troubleshooting.md": {
	id: "advanced/troubleshooting.md";
  slug: "advanced/troubleshooting";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"core-concepts/conventions.md": {
	id: "core-concepts/conventions.md";
  slug: "core-concepts/conventions";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"core-concepts/regions.md": {
	id: "core-concepts/regions.md";
  slug: "core-concepts/regions";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"core-concepts/safety.md": {
	id: "core-concepts/safety.md";
  slug: "core-concepts/safety";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"core-concepts/services.md": {
	id: "core-concepts/services.md";
  slug: "core-concepts/services";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"examples/gpu-vm.md": {
	id: "examples/gpu-vm.md";
  slug: "examples/gpu-vm";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"examples/openclaw.md": {
	id: "examples/openclaw.md";
  slug: "examples/openclaw";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"examples/serverless.md": {
	id: "examples/serverless.md";
  slug: "examples/serverless";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"intro.md": {
	id: "intro.md";
  slug: "intro";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"intro/authentication.md": {
	id: "intro/authentication.md";
  slug: "intro/authentication";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"intro/installation.md": {
	id: "intro/installation.md";
  slug: "intro/installation";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"intro/quickstart.md": {
	id: "intro/quickstart.md";
  slug: "intro/quickstart";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"services/compute.md": {
	id: "services/compute.md";
  slug: "services/compute";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"services/endpoints.md": {
	id: "services/endpoints.md";
  slug: "services/endpoints";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"services/iam.md": {
	id: "services/iam.md";
  slug: "services/iam";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"services/kubernetes.md": {
	id: "services/kubernetes.md";
  slug: "services/kubernetes";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"services/networking.md": {
	id: "services/networking.md";
  slug: "services/networking";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"services/registry.md": {
	id: "services/registry.md";
  slug: "services/registry";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
