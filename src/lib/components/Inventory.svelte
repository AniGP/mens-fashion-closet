<script lang="ts">
  import { Shirt, Layers, PersonStanding, Footprints, Trash2, Image as ImageIcon } from 'lucide-svelte';
  import type { Item, Category } from '../types';

  interface Props {
      items: Item[];
      onDelete: (id: string) => void;
  }

  let { items, onDelete }: Props = $props();

  const CATEGORY_CONFIG: Record<Category, { icon: any, label: string }> = {
      'Tops': { icon: Shirt, label: 'Tops' },
      'Bottoms': { icon: PersonStanding, label: 'Bottoms' },
      'Outerwear': { icon: Layers, label: 'Outerwear' },
      'Footwear': { icon: Footprints, label: 'Footwear' }
  };
  
  const categories = Object.keys(CATEGORY_CONFIG) as Category[];

  function getCategoryItems(cat: Category) {
      return items.filter(i => i.category === cat);
  }
</script>

<div class="space-y-8">
  {#each categories as cat}
      {@const { icon: Icon, label } = CATEGORY_CONFIG[cat]}
      {@const catItems = getCategoryItems(cat)}
      
      <section>
          <div class="flex items-center gap-2 mb-4 text-slate-400 border-b border-slate-800 pb-2">
              <Icon size={20} />
              <h3 class="text-sm font-medium uppercase tracking-widest">{label}</h3>
              <span class="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-500">{catItems.length}</span>
          </div>

          {#if catItems.length === 0}
              <div class="text-slate-600 text-sm italic py-4">No items yet.</div>
          {:else}
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {#each catItems as item (item.id)}
                      <div class="group relative bg-slate-900 border border-slate-800 rounded overflow-hidden hover:bg-slate-800 transition-all">
                          
                          <!-- Image or Placeholder -->
                          <div class="h-32 w-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
                              {#if item.image}
                                  <img src={item.image} alt={item.name} class="w-full h-full object-cover" />
                              {:else}
                                  <div class="text-slate-800">
                                      <Icon size={48} strokeWidth={1} />
                                  </div>
                              {/if}

                              <!-- Delete overlay -->
                              <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-slate-950/50 p-1 rounded">
                                  <button
                                      onclick={() => onDelete(item.id)}
                                      class="text-white hover:text-red-400 block"
                                      aria-label="Delete item"
                                  >
                                      <Trash2 size={14} />
                                  </button>
                              </div>
                          </div>

                          <div class="p-3">
                              <div class="flex justify-between items-start gap-2">
                                  <h4 class="font-medium text-cream-50 text-sm truncate">{item.name}</h4>
                                  {#if item.color}
                                      <div
                                          class="w-3 h-3 rounded-full border border-slate-700 shadow-sm shrink-0 mt-1"
                                          style="background-color: {item.color === 'Other' ? 'transparent' : item.color.toLowerCase()}"
                                          title={item.color}
                                      ></div>
                                  {/if}
                              </div>
                              <p class="text-xs text-slate-400 mt-1">{item.vibe}</p>
                          </div>
                      </div>
                  {/each}
              </div>
          {/if}
      </section>
  {/each}
</div>
