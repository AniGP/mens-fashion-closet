<script lang="ts">
  import { Trash2, Heart } from 'lucide-svelte';
  import type { SavedOutfit, Category } from '../types';

  interface Props {
      outfits: SavedOutfit[];
      onDelete: (id: string) => void;
  }

  let { outfits, onDelete }: Props = $props();

  const CAT_ORDER: Category[] = ['Tops', 'Bottoms', 'Outerwear', 'Footwear'];
</script>

{#if outfits && outfits.length > 0}
  <div class="mb-12">
      <h2 class="text-lg font-light text-slate-400 mb-6 uppercase tracking-widest border-l-2 border-red-400 pl-3 flex items-center gap-2">
          Saved Lookbook <Heart size={16} class="text-red-400 fill-red-400" />
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each outfits as outfit (outfit.id)}
              <div class="bg-slate-900 border border-slate-800 rounded-lg p-4 group hover:border-slate-700 transition-all relative">
                  <button
                      onclick={() => onDelete(outfit.id)}
                      class="absolute top-2 right-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-10"
                      title="Remove Look"
                  >
                      <Trash2 size={16} />
                  </button>

                  <div class="text-xs text-slate-500 mb-2 font-mono">{new Date(outfit.date).toLocaleDateString()}</div>
                  
                  <div class="grid grid-cols-2 gap-2">
                      {#each CAT_ORDER as cat}
                          {#if outfit.items && outfit.items[cat]}
                              {@const item = outfit.items[cat]}
                              <div class="flex items-center gap-2 overflow-hidden">
                                  {#if item.image}
                                      <img src={item.image} class="w-8 h-8 rounded object-cover border border-slate-800" alt={item.name} />
                                  {:else}
                                      <div class="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex-shrink-0"></div>
                                  {/if}
                                  <div class="truncate text-xs text-cream-100 opacity-80">{item.name}</div>
                              </div>
                          {/if}
                      {/each}
                  </div>
              </div>
          {/each}
      </div>
  </div>
{/if}
