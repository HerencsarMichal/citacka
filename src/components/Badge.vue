<template>
    <span class="badge" :class="[variant, size]">
        <span v-if="icon" class="badge-icon">{{ icon }}</span>
        <slot></slot>
    </span>
</template>

<script>
export default {
    name: 'Badge',
    props: {
        variant: {
            type: String,
            default: 'default',
            validator: (value) => ['default', 'success', 'warning', 'danger', 'info', 'primary'].includes(value)
        },
        size: {
            type: String,
            default: 'medium',
            validator: (value) => ['small', 'medium', 'large'].includes(value)
        },
        icon: {
            type: String,
            default: null
        }
    }
}
</script>

<style scoped>
.badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    border-radius: 6px;
    font-weight: 600;
    white-space: nowrap;
}

/* Sizes */
.badge.small {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}

.badge.medium {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
}

.badge.large {
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
}

/* Variants */
.badge.default {
    background-color: var(--gray-200);
    color: var(--gray-700);
}

.badge.success {
    background-color: #E8F5E9;
    color: #388E3C;
}

.badge.warning {
    background-color: #FFF3E0;
    color: #F57C00;
}

.badge.danger {
    background-color: #FFEBEE;
    color: #D32F2F;
}

.badge.info {
    background-color: #E3F2FD;
    color: #1976D2;
}

.badge.primary {
    background-color: var(--gold);
    color: var(--brown-dark);
}

.badge-icon {
    font-size: 1em;
}
</style>