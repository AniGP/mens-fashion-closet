<script lang="ts">
  import { Plus, X } from 'lucide-svelte';
  import { CATEGORIES_LIST, VIBES_LIST, COLORS_LIST } from '../types';
  import type { Item, Category, Vibe, Color } from '../types';

  interface Props {
      onAdd: (item: Omit<Item, 'id'>) => void;
  }

  let { onAdd }: Props = $props();

  let isOpen = $state(false);
  let formData = $state<Omit<Item, 'id'>>({
      name: '',
      category: 'Tops',
      vibe: 'Casual',
      color: 'Black',
      image: undefined
  });

  function handleSubmit(e: Event) {
      e.preventDefault();
      if (!formData.name) return;

      onAdd({ ...formData });
      
      // Reset
      formData = {
          name: '',
          category: 'Tops',
          vibe: 'Casual',
          color: 'Black',
          image: undefined
      };
      isOpen = false;
  }
  
  function handleFileChange(e: Event) {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              formData.image = reader.result as string;
          };
          reader.readAsDataURL(file);
      }
  }
</script>

{#if !isOpen}
  <button
      onclick={() => isOpen = true}
      class="fixed bottom-8 right-8 bg-cream-100 text-slate-950 p-4 rounded-full shadow-2xl hover:bg-white hover:scale-105 transition-all z-50 flex items-center gap-2 font-medium"
  >
      <Plus size={24} />
      <span class="hidden md:inline">Add Item</span>
  </button>
{:else}
  <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-900 w-full max-w-md rounded-xl border border-slate-800 shadow-2xl overflow-hidden p-6 relative animate-in fade-in zoom-in duration-200">
          <button
              onclick={() => isOpen = false}
              class="absolute top-4 right-4 text-slate-500 hover:text-cream-100 transition-colors"
          >
              <X size={20} />
          </button>

          <h2 class="text-xl font-light text-cream-50 mb-6">Add New Item</h2>

          <form onsubmit={handleSubmit} class="space-y-4">
               <div>
                  <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Item Name</label>
                  <input
                      type="text"
                      bind:value={formData.name}
                      placeholder="e.g. Oxford Shirt"
                      class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-cream-50 focus:outline-none focus:border-cream-100/30 transition-colors placeholder:text-slate-700"
                      autofocus
                  />
              </div>

               <div class="grid grid-cols-2 gap-4">
                  <div>
                      <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Category</label>
                      <div class="relative">
                          <select
                              bind:value={formData.category}
                              class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-cream-50 focus:outline-none focus:border-cream-100/30 appearance-none cursor-pointer"
                          >
                              {#each CATEGORIES_LIST as c}
                                  <option value={c}>{c}</option>
                              {/each}
                          </select>
                      </div>
                  </div>

                  <div>
                      <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Vibe</label>
                      <select
                          bind:value={formData.vibe}
                          class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-cream-50 focus:outline-none focus:border-cream-100/30 appearance-none cursor-pointer"
                      >
                          {#each VIBES_LIST as v}
                              <option value={v}>{v}</option>
                          {/each}
                      </select>
                  </div>
              </div>

               <div class="grid grid-cols-2 gap-4">
                  <div>
                      <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Color (Optional)</label>
                      <select
                          bind:value={formData.color}
                          class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-cream-50 focus:outline-none focus:border-cream-100/30 appearance-none cursor-pointer"
                      >
                          {#each COLORS_LIST as c}
                              <option value={c}>{c}</option>
                          {/each}
                      </select>
                  </div>
                  <div>
                      <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Image (Optional)</label>
                      <input
                          type="file"
                          accept="image/*"
                          onchange={handleFileChange}
                          class="w-full bg-slate-950 text-slate-400 text-xs border border-slate-800 rounded p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cream-100 hover:file:bg-slate-700"
                      />
                  </div>
              </div>

              <button
                  type="submit"
                  class="w-full bg-cream-100 text-slate-950 font-medium py-3 rounded mt-4 hover:bg-white transition-colors"
              >
                  Add to Closet
              </button>
          </form>
      </div>
  </div>
{/if}
