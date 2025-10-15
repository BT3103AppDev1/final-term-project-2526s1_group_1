<script>
import { defineComponent, h } from 'vue'

// local version of cn() — joins class strings safely
function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const Card = defineComponent({
  name: 'Card',
  props: { className: { type: String, default: '' } },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          'data-slot': 'card',
          class: cn(
            'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
            props.className
          )
        },
        slots.default ? slots.default() : []
      )
  }
})

export const CardHeader = defineComponent({
  name: 'CardHeader',
  props: { className: { type: String, default: '' } },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          'data-slot': 'card-header',
          class: cn(
            'grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 border-b pb-4',
            props.className
          )
        },
        slots.default ? slots.default() : []
      )
  }
})

export const CardTitle = defineComponent({
  name: 'CardTitle',
  props: { className: { type: String, default: '' } },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          'data-slot': 'card-title',
          class: cn('leading-none font-semibold text-lg', props.className)
        },
        slots.default ? slots.default() : []
      )
  }
})

export const CardDescription = defineComponent({
  name: 'CardDescription',
  props: { className: { type: String, default: '' } },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          'data-slot': 'card-description',
          class: cn('text-muted-foreground text-sm', props.className)
        },
        slots.default ? slots.default() : []
      )
  }
})

export const CardAction = defineComponent({
  name: 'CardAction',
  props: { className: { type: String, default: '' } },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          'data-slot': 'card-action',
          class: cn(
            'self-start justify-self-end',
            props.className
          )
        },
        slots.default ? slots.default() : []
      )
  }
})

export const CardContent = defineComponent({
  name: 'CardContent',
  props: { className: { type: String, default: '' } },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          'data-slot': 'card-content',
          class: cn('px-6', props.className)
        },
        slots.default ? slots.default() : []
      )
  }
})

export const CardFooter = defineComponent({
  name: 'CardFooter',
  props: { className: { type: String, default: '' } },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          'data-slot': 'card-footer',
          class: cn('flex items-center px-6 border-t pt-4', props.className)
        },
        slots.default ? slots.default() : []
      )
  }
})
</script>
