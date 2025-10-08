<template>
  <form class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Email</label>
      <input
        type="email"
        placeholder="you@example.com"
        class="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
      />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Password</label>
      <input
        type="password"
        placeholder="••••••••"
        class="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
      />
    </div>
    <button
      type="submit"
      class="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition"
    >
      Sign In
    </button>
  </form>
</template>
