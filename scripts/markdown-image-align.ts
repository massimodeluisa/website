import MarkdownIt from 'markdown-it'
import type { StateCore } from 'markdown-it'

const ALIGN_RE = /^\s*\{\s*\.(img-left|img-right|img-center)\s*\}\s*/

type TMarkdown = InstanceType<typeof MarkdownIt>

/** Reads `{.img-left}` / `{.img-right}` / `{.img-center}` after a markdown image and sets that class on the `<img>`. */
export function markdownImageAlign(md: TMarkdown): void {
  md.core.ruler.after('inline', 'image-align', (state: StateCore) => {
    for (const block of state.tokens) {
      if (block.type !== 'inline' || !block.children) {
        continue
      }
      const children = block.children
      for (let i = 0; i < children.length; i++) {
        const token = children[i]
        if (token.type !== 'image') {
          continue
        }
        const next = children[i + 1]
        if (!next || next.type !== 'text') {
          continue
        }
        const match = ALIGN_RE.exec(next.content)
        if (!match) {
          continue
        }
        token.attrJoin('class', match[1])
        next.content = next.content.slice(match[0].length)
        if (next.content.length === 0) {
          children.splice(i + 1, 1)
        }
      }
    }
  })
}
