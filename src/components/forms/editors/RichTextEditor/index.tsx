'use client'

import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { TRANSFORMERS } from '@lexical/markdown'
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
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import clsx from 'clsx'
import { EditorState } from 'lexical'

import { ImageNode } from './nodes/ImageNode'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
// TODO drag drop image files dose not work
// import DragDropPaste from './plugins/DragDropPastePlugin'
import ImagePlugin from './plugins/ImagePlugin'
import ToolbarPlugin from './plugins/ToolbarPlugin'
// import TreeViewPlugin from "./plugins/TreeViewPlugin";
import theme from './themes/RichTextEditorTheme'

export type RichTextEditorValue = EditorState | string

export function createEmptyValue(): RichTextEditorValue {
  // empty paragraph
  return '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}'
}

export function getJsonString(value: RichTextEditorValue): string {
  if (typeof value === 'string') {
    return value
  } else {
    return JSON.stringify(value.toJSON())
  }
}

interface Props {
  name: string
  value?: RichTextEditorValue | null
  onChange: (value: RichTextEditorValue) => void
  placeholder?: string
  label?: string
  wrapperClassName?: string
}

export function RichTextEditor({
  name,
  value,
  onChange,
  placeholder,
  label,
  wrapperClassName,
}: Props) {
  const initialConfig: InitialConfigType = {
    namespace: `RTE-${name}`,
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
      CodeNode,
      CodeHighlightNode,
      ImageNode,
      TableNode,
      TableCellNode,
      TableRowNode,
    ],
  }

  const handleOnChange = (editorState: EditorState) => {
    // console.log(JSON.stringify(editorState.toJSON()))
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
                <ContentEditable className="min-h-24 px-6 py-4 focus:ring-2 focus:ring-inset focus:ring-primary-500 focus:border-primary-500" />
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
            <CodeHighlightPlugin />
            <ImagePlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            {/*<TreeViewPlugin />*/}
          </div>
        </div>
      </LexicalComposer>
    </div>
  )
}
