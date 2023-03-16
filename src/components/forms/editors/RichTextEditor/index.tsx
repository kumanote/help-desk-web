'use client'

import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import clsx from 'clsx'
import { $getRoot, $getSelection, EditorState } from 'lexical'

import ToolbarPlugin from './plugins/ToolbarPlugin'
import theme from './themes/RichTextEditorTheme'

export type RichTextEditorValue = EditorState | null

export function createEmptyValue(): RichTextEditorValue {
  return null
}

interface Props {
  value?: RichTextEditorValue | null
  onChange: (value: RichTextEditorValue) => void
  placeholder?: string
  label?: string
  wrapperClassName?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  label,
  wrapperClassName,
}: Props) {
  const initialConfig: InitialConfigType = {
    namespace: 'MyEditor',
    onError(error: Error) {
      throw error
    },
    theme,
    editorState: value,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListItemNode,
      ListNode,
      AutoLinkNode,
      LinkNode,
    ],
  }

  const handleOnChange = (editorState: EditorState) => {
    editorState.read(() => {
      // Read the contents of the EditorState here.
      const root = $getRoot()
      const selection = $getSelection()

      console.log(root, selection)
    })
    onChange(editorState)
  }

  return (
    <div className={clsx(wrapperClassName)}>
      {label && (
        <div className="block text-sm font-medium text-color-label mb-1">
          {label}
        </div>
      )}
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative bg-color-base border-base text-color-base rounded-md divide-y divide-color-base">
          <ToolbarPlugin />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="min-h-24 px-6 py-4" />
              }
              placeholder={
                <div className="absolute top-4 left-6 truncate inline-block select-none pointer-events-none text-base text-color-dimmed">
                  {placeholder || 'Enter some text'}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleOnChange} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
          </div>
        </div>
      </LexicalComposer>
    </div>
  )
}
