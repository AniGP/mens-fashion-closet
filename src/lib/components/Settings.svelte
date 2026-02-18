<script lang="ts">
    import { X, Save, Key, Trash2 } from "lucide-svelte";

    interface Props {
        isOpen: boolean;
        onClose: () => void;
        apiKey: string;
        onSaveKey: (key: string) => void;
    }

    let { isOpen, onClose, apiKey, onSaveKey }: Props = $props();

    let inputKey = $state(apiKey);

    $effect(() => {
        inputKey = apiKey;
    });

    function handleSave() {
        onSaveKey(inputKey);
        onClose();
    }

    function handleClear() {
        inputKey = "";
        onSaveKey("");
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
        <div
            class="bg-slate-900 w-full max-w-md rounded-xl border border-slate-800 shadow-2xl overflow-hidden p-6 relative animate-in zoom-in-95 duration-200"
        >
            <button
                onclick={onClose}
                class="absolute top-4 right-4 text-slate-500 hover:text-cream-100 transition-colors"
            >
                <X size={20} />
            </button>

            <div class="flex items-center gap-3 mb-6 text-cream-50">
                <div class="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <Key size={24} />
                </div>
                <h2 class="text-xl font-light">AI Settings</h2>
            </div>

            <div class="space-y-4">
                <div>
                    <label
                        class="block text-xs uppercase tracking-wider text-slate-400 mb-1"
                        >Gemini API Key</label
                    >
                    <input
                        type="password"
                        bind:value={inputKey}
                        placeholder="AIzaSy..."
                        class="w-full bg-slate-950 border border-slate-800 rounded p-3 text-cream-50 focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-700 font-mono text-sm"
                    />
                    <p class="text-[10px] text-slate-500 mt-2">
                        Your key is stored locally in your browser. Get one at <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            class="text-indigo-400 hover:underline"
                            >aistudio.google.com</a
                        >.
                    </p>
                </div>

                <div class="flex gap-3 mt-6">
                    <button
                        onclick={handleSave}
                        class="flex-1 bg-indigo-600 text-white font-medium py-2.5 rounded hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save size={16} />
                        Save Key
                    </button>
                    {#if apiKey}
                        <button
                            onclick={handleClear}
                            class="px-4 py-2.5 rounded border border-red-900/30 text-red-400 hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
                            title="Clear Key"
                        >
                            <Trash2 size={16} />
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}
