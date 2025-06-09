// === IMPORT OTHER EFFECT CLASSES HERE ===
import { CosmicParticleEffect } from './cosmic-particle-effect.js';
// import { GlowEffect } from './glow-effect.js';
// import { RainbowBorderEffect } from './rainbow-border-effect.js';
// import { FloatingIconsEffect } from './floating-icons-effect.js';
// === END IMPORTS SECTION ===


// Profile effect manager
export class ProfileEffectManager {
    constructor() {
        this.activeEffects = new Map();
    }

    // Apply cosmic particle effect to a profile
    applyCosmicParticleEffect(profileElement) {
        const effectId = 'cosmic-particle-' + Date.now();
        const effect = new CosmicParticleEffect(profileElement);
        
        this.activeEffects.set(effectId, effect);
        effect.start();
        
        return effectId;
    }

    // === ADD OTHER EFFECTS HERE ===
    // Example structure for new effects:
    // applyGlowEffect(profileElement) {
    //     const effectId = 'glow-effect-' + Date.now();
    //     const effect = new GlowEffect(profileElement);
    //     this.activeEffects.set(effectId, effect);
    //     effect.start();
    //     return effectId;
    // }
    
    // applyRainbowBorderEffect(profileElement) {
    //     const effectId = 'rainbow-border-' + Date.now();
    //     const effect = new RainbowBorderEffect(profileElement);
    //     this.activeEffects.set(effectId, effect);
    //     effect.start();
    //     return effectId;
    // }
    // === END NEW EFFECTS SECTION ===

    // Remove effect by ID
    removeEffect(effectId) {
        const effect = this.activeEffects.get(effectId);
        if (effect) {
            effect.destroy();
            this.activeEffects.delete(effectId);
        }
    }

    // Remove all effects from a profile
    removeAllEffectsFromProfile(profileElement) {
        this.activeEffects.forEach((effect, effectId) => {
            if (effect.container === profileElement) {
                effect.destroy();
                this.activeEffects.delete(effectId);
            }
        });
    }

    // Check if profile has cosmic particle effect enabled
    hasCosmicParticleEffect(profileElement) {
        for (let [effectId, effect] of this.activeEffects) {
            if (effect.container === profileElement && effect.isActive) {
                return true;
            }
        }
        return false;
    }

    // === ADD CHECKER METHODS FOR OTHER EFFECTS HERE ===
    // hasGlowEffect(profileElement) {
    //     for (let [effectId, effect] of this.activeEffects) {
    //         if (effectId.startsWith('glow-effect-') && effect.container === profileElement && effect.isActive) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    // === END CHECKER METHODS SECTION ===
}

// Integration function for your existing inventory system
export function handleProfileEffects(userInventory, profileElement, effectManager) {
    // Find cosmic particle effect in inventory
    const cosmicEffect = userInventory.find(item => 
        item.id === 'effect-1' && item.enabled === true
    );

    const hasCosmicEffect = effectManager.hasCosmicParticleEffect(profileElement);

    if (cosmicEffect && !hasCosmicEffect) {
        // Apply the effect
        effectManager.applyCosmicParticleEffect(profileElement);
    } else if (!cosmicEffect && hasCosmicEffect) {
        // Remove the effect
        effectManager.removeAllEffectsFromProfile(profileElement);
    }

    // === ADD OTHER EFFECT HANDLERS HERE ===
    // Example for other effects:
    // const glowEffect = userInventory.find(item => 
    //     item.id === 'effect-2' && item.enabled === true
    // );
    // const hasGlowEffect = effectManager.hasGlowEffect(profileElement);
    // 
    // if (glowEffect && !hasGlowEffect) {
    //     effectManager.applyGlowEffect(profileElement);
    // } else if (!glowEffect && hasGlowEffect) {
    //     // Remove specific effect or use removeAllEffectsFromProfile
    // }
    
    // const rainbowBorderEffect = userInventory.find(item => 
    //     item.id === 'effect-3' && item.enabled === true
    // );
    // const hasRainbowBorderEffect = effectManager.hasRainbowBorderEffect(profileElement);
    // 
    // if (rainbowBorderEffect && !hasRainbowBorderEffect) {
    //     effectManager.applyRainbowBorderEffect(profileElement);
    // } else if (!rainbowBorderEffect && hasRainbowBorderEffect) {
    //     // Remove specific effect
    // }
    // === END OTHER EFFECTS SECTION ===
}
