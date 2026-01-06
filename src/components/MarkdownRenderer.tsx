/**
 * Simple Markdown Renderer
 * Converts basic markdown syntax to HTML
 */

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // Simple markdown to HTML converter
  const parseMarkdown = (text: string): string => {
    let html = text

    // Headers (## Header)
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold mt-4 mb-2">$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mt-4 mb-3">$1</h1>')

    // Bold (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')

    // Italic (*text*)
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

    // Code blocks (```code```)
    html = html.replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-black/30 p-3 rounded my-2 overflow-x-auto"><code>$1</code></pre>',
    )

    // Inline code (`code`)
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-black/30 px-1.5 py-0.5 rounded text-sm">$1</code>',
    )

    // Links ([text](url))
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-[hsl(var(--orange-primary))] hover:text-[hsl(var(--orange-hover))] underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    // Unordered lists (- item or * item)
    html = html.replace(/^[*-] (.*$)/gim, '<li class="ml-4">$1</li>')
    html = html.replace(/(<li.*<\/li>)/s, '<ul class="list-disc my-2 space-y-1">$1</ul>')

    // Ordered lists (1. item)
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')

    // Line breaks
    html = html.replace(/\n\n/g, '<br/><br/>')
    html = html.replace(/\n/g, '<br/>')

    return html
  }

  return (
    <div
      className={`markdown-content text-white/90 leading-relaxed ${className}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown content is parsed internally
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  )
}
