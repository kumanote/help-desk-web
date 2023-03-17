'use client'

import { CheckIcon, PencilIcon } from '@heroicons/react/20/solid'
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ChevronDownIcon,
  CodeBracketIcon,
  CodeBracketSquareIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { $createCodeNode } from '@lexical/code'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import { ListNodeTagType } from '@lexical/list/LexicalListNode'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text'
import { $isAtNodeEnd, $wrapNodes } from '@lexical/selection'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import clsx from 'clsx'
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  EditorState,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import {
  GridSelection,
  NodeSelection,
  RangeSelection,
} from 'lexical/LexicalSelection'
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

const LowPriority = 1

type TypographyType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
const supportedTypographyTypeArray: Array<TypographyType> = [
  'paragraph',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
]

function BlockTypeIcon({
  blockType,
  className,
}: {
  blockType: string
  className?: string
}) {
  switch (blockType) {
    case 'h1':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
          className={className}
        >
          <path d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.258V8.728h4.62V13h1.259zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z" />
        </svg>
      )
    case 'h2':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
          className={className}
        >
          <path d="M7.638 13V3.669H6.38V7.62H1.759V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V13H15.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z" />
        </svg>
      )
    case 'h3':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
          className={className}
        >
          <path d="M7.637 13V3.669H6.379V7.62H1.758V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.625-4.272h1.018c1.142 0 1.935.67 1.949 1.674.013 1.005-.78 1.737-2.01 1.73-1.08-.007-1.853-.588-1.935-1.32H9.108c.069 1.327 1.224 2.386 3.083 2.386 1.935 0 3.343-1.155 3.309-2.789-.027-1.51-1.251-2.16-2.037-2.249v-.068c.704-.123 1.764-.91 1.723-2.229-.035-1.353-1.176-2.4-2.954-2.385-1.873.006-2.857 1.162-2.898 2.358h1.196c.062-.69.711-1.299 1.696-1.299.998 0 1.695.622 1.695 1.525.007.922-.718 1.592-1.695 1.592h-.964v1.074z" />
        </svg>
      )
    case 'h4':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 11"
          className={className}
        >
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(0.000000, 0.689453)" fill="currentColor">
              <path d="M13.0607591,6.03591226 L13.0607591,1.81922006 L10.0785376,6.03591226 L13.0607591,6.03591226 Z M13.0802507,9.33 L13.0802507,7.05597493 L9,7.05597493 L9,5.91246518 L13.2621727,0 L14.2497493,0 L14.2497493,6.03591226 L15.6206616,6.03591226 L15.6206616,7.05597493 L14.2497493,7.05597493 L14.2497493,9.33 L13.0802507,9.33 Z"></path>
              <polygon points="7.137 9.331 7.137 0 5.879 0 5.879 3.951 1.258 3.951 1.258 0.001 0 0.001 0 9.331 1.258 9.331 1.258 5.059 5.878 5.059 5.878 9.331"></polygon>
            </g>
          </g>
        </svg>
      )
    case 'h5':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 11"
          className={className}
        >
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(0.000000, 0.689453)" fill="currentColor">
              <path
                d="M10.2082479,6.73905125 C10.2857825,7.40240305 10.5937673,7.86114958 11.1322022,8.11529086 C11.4078809,8.24451524 11.7266343,8.30912742 12.0884626,8.30912742 C12.7776593,8.30912742 13.2880956,8.08944598 13.6197715,7.6500831 C13.9514474,7.21072022 14.1172853,6.72397507 14.1172853,6.18984765 C14.1172853,5.54372576 13.9202181,5.04405817 13.5260838,4.69084488 C13.1319494,4.33763158 12.6592036,4.16102493 12.1078463,4.16102493 C11.7072507,4.16102493 11.3637292,4.23855956 11.0772819,4.39362881 C10.7908345,4.54869806 10.546385,4.76407202 10.3439335,5.03975069 L9.33598338,4.98159972 L10.0402562,0 L14.847403,0 L14.847403,1.12425208 L10.9125208,1.12425208 L10.5183864,3.69581717 C10.7337604,3.53213296 10.9383657,3.40936981 11.1322022,3.3275277 C11.4768006,3.18538089 11.8752424,3.11430748 12.3275277,3.11430748 C13.1761011,3.11430748 13.8954501,3.38783241 14.4855748,3.93488227 C15.0756994,4.48193213 15.3707618,5.17543629 15.3707618,6.01539474 C15.3707618,6.88981302 15.1004675,7.6608518 14.5598788,8.32851108 C14.0192902,8.99617036 13.1567175,9.33 11.9721607,9.33 C11.2183518,9.33 10.5517694,9.11785665 9.97241343,8.69356994 C9.39305748,8.26928324 9.06891967,7.61777701 9,6.73905125 L10.2082479,6.73905125 Z"
                id="Path"
              ></path>
              <polygon points="7.137 9.331 7.137 0 5.879 0 5.879 3.951 1.258 3.951 1.258 0.001 0 0.001 0 9.331 1.258 9.331 1.258 5.059 5.878 5.059 5.878 9.331"></polygon>
            </g>
          </g>
        </svg>
      )
    case 'paragraph':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
          className={className}
        >
          <path
            fillRule="evenodd"
            d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      )
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
          className={className}
        >
          <path
            fillRule="evenodd"
            d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      )
  }
}

function getBlockTypeToBlockName(blockType: string): string {
  switch (blockType) {
    case 'h1':
      return 'Heading 1'
    case 'h2':
      return 'Heading 2'
    case 'h3':
      return 'Heading 3'
    case 'h4':
      return 'Heading 4'
    case 'h5':
      return 'Heading 5'
    case 'paragraph':
      return 'Normal'
    default:
      return 'Normal'
  }
}

function positionEditorElement(editor: HTMLDivElement, rect: DOMRect | null) {
  if (rect === null) {
    editor.style.opacity = '0'
    editor.style.top = '-1000px'
    editor.style.left = '-1000px'
  } else {
    editor.style.opacity = '1'
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`
  }
}

function FloatingLinkEditor({ editor }: { editor: LexicalEditor }) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const mouseDownRef = useRef(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [isEditMode, setEditMode] = useState(false)
  const [lastSelection, setLastSelection] = useState<
    null | RangeSelection | NodeSelection | GridSelection
  >(null)

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl('')
      }
    }
    const editorElem = editorRef.current
    const nativeSelection = window.getSelection()
    const activeElement = document.activeElement

    if (editorElem === null) {
      return
    }

    const rootElement = editor.getRootElement()
    if (
      selection !== null &&
      nativeSelection &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0)
      let rect
      if (nativeSelection.anchorNode === rootElement) {
        let inner: HTMLElement | Element | null = rootElement
        while (inner && inner.firstElementChild != null) {
          inner = inner.firstElementChild
        }
        rect = inner.getBoundingClientRect()
      } else {
        rect = domRange.getBoundingClientRect()
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect)
      }
      setLastSelection(selection)
    } else if (!activeElement || activeElement.className !== 'link-input') {
      positionEditorElement(editorElem, null)
      setLastSelection(null)
      setEditMode(false)
      setLinkUrl('')
    }

    return true
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(
        ({ editorState }: { editorState: EditorState }) => {
          editorState.read(() => {
            updateLinkEditor()
          })
        }
      ),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor()
          return true
        },
        LowPriority
      )
    )
  }, [editor, updateLinkEditor])

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor()
    })
  }, [editor, updateLinkEditor])

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditMode])

  return (
    <div
      ref={editorRef}
      className="absolute -mt-3 max-w-64 bg-color-sheet rounded-md z-50 p-1.5"
    >
      {isEditMode ? (
        <input
          ref={inputRef}
          className="relative block w-full px-2 py-1 border-base rounded-md focus:ring-2 focus:ring-inset focus:ring-primary-500 focus:border-primary-500"
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              if (lastSelection !== null) {
                if (linkUrl !== '') {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)
                }
                setEditMode(false)
              }
            } else if (event.key === 'Escape') {
              event.preventDefault()
              setEditMode(false)
            }
          }}
        />
      ) : (
        <>
          <div className="relative block px-2 py-1 border-base rounded-md">
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[calc(100%_-_24px)] text-primary-500 hover:text-primary-400 dark:hover:text-primary-600 whitespace-nowrap overflow-hidden truncate mr-9"
            >
              {linkUrl}
            </a>
            <span
              role="button"
              tabIndex={0}
              className="absolute right-0 top-0 bottom-0 cursor-pointer flex items-center justify-center p-1 rounded-full"
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.preventDefault()
                setEditMode(true)
              }}
            >
              <PencilIcon className="w-4 h-4" />
            </span>
          </div>
        </>
      )}
    </div>
  )
}

function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor
  const focus = selection.focus
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()
  if (anchorNode === focusNode) {
    return anchorNode
  }
  const isBackward = selection.isBackward()
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode
  }
}

function TypographyOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  setShowTypographyOptionsDropDown,
}: {
  editor: LexicalEditor
  blockType: string
  toolbarRef: MutableRefObject<HTMLDivElement | null>
  setShowTypographyOptionsDropDown: (value: boolean) => void
}) {
  const dropDownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const toolbar = toolbarRef.current
    const dropDown = dropDownRef.current

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect()
      dropDown.style.top = `${top + 40}px`
      dropDown.style.left = `${left}px`
    }
  }, [dropDownRef, toolbarRef])

  useEffect(() => {
    const dropDown = dropDownRef.current
    const toolbar = toolbarRef.current

    if (dropDown !== null && toolbar !== null) {
      const handle = (event: any) => {
        const target = event.target

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowTypographyOptionsDropDown(false)
        }
      }
      document.addEventListener('click', handle)

      return () => {
        document.removeEventListener('click', handle)
      }
    }
  }, [dropDownRef, setShowTypographyOptionsDropDown, toolbarRef])

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode())
        }
      })
    }
    setShowTypographyOptionsDropDown(false)
  }

  const formatHeading = (headingType: HeadingTagType) => {
    if (blockType !== headingType) {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode(headingType))
        }
      })
    }
    setShowTypographyOptionsDropDown(false)
  }

  const handleMenuClick = (blockType: string) => {
    switch (blockType) {
      case 'paragraph':
        formatParagraph()
        break
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
        formatHeading(blockType)
        break
    }
  }

  return (
    <div
      className="absolute z-10 bg-color-sheet flex flex-col"
      ref={dropDownRef}
    >
      {supportedTypographyTypeArray.map((option) => {
        return (
          <button
            key={option}
            className="relative flex items-center py-2 pl-2 pr-10 cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={(event) => {
              event.preventDefault()
              handleMenuClick(option)
            }}
          >
            <BlockTypeIcon blockType={option} className="h-5 w-5" />
            <span
              className={clsx(
                'ml-2 flex-grow text-left',
                option === 'h1'
                  ? 'text-2xl font-bold'
                  : option === 'h2'
                  ? 'text-xl font-bold'
                  : option === 'h3'
                  ? 'text-lg font-semibold'
                  : option === 'h4'
                  ? 'text-base font-semibold'
                  : option === 'h5'
                  ? 'text-sm font-semibold'
                  : 'text-sm'
              )}
            >
              {getBlockTypeToBlockName(option)}
            </span>
            {blockType === option && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-primary-600">
                <CheckIcon className="h-4 w-4" />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [blockType, setBlockType] = useState<
    HeadingTagType | ListNodeTagType | string
  >('paragraph')

  const [showTypographyOptionsDropDown, setShowTypographyOptionsDropDown] =
    useState(false)
  const [isLink, setIsLink] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()
      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode)
          const type = parentList ? parentList.getTag() : element.getTag()
          setBlockType(type)
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType()
          setBlockType(type)
        }
      }
      // Update text format
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsCode(selection.hasFormat('code'))

      // Update links
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }
    }
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar()
          return false
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        LowPriority
      )
    )
  }, [editor, updateToolbar])

  const isUl = blockType === 'ul'
  const isUlEnabled = blockType !== 'code'
  const isOl = blockType === 'ol'
  const isOlEnabled = blockType !== 'code'
  const isQuote = blockType === 'quote'
  const isQuoteEnabled = blockType !== 'code'
  const isBoldEnable = blockType !== 'code'
  const isItalicEnable = blockType !== 'code'
  const isUnderlineEnable = blockType !== 'code'
  const isStrikethroughEnable = blockType !== 'code'
  const isCodeEnable = blockType !== 'code'
  const isCodeBlockEnable = blockType !== 'code'
  const isLinkEnable = blockType !== 'code'
  const isAlignEnable = blockType !== 'code'

  const insertLink = useCallback(
    (event: any) => {
      event.preventDefault()
      if (!isLinkEnable) return false
      if (!isLink) {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const maybeLinkTest = selection.getTextContent()
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, maybeLinkTest)
          } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://')
          }
        })
      } else {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
      }
    },
    [editor, isLinkEnable, isLink]
  )

  return (
    <div
      className="flex items-stretch bg-color-base divide-x divide-color-base px-1 rounded-t-md overflow-x-auto hidden-scrollbar"
      ref={toolbarRef}
    >
      <div className="flex items-center space-x-1 px-1">
        <button
          type="button"
          disabled={!canUndo}
          onClick={(event) => {
            event.preventDefault()
            editor.dispatchCommand(UNDO_COMMAND, undefined)
          }}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            canUndo
              ? 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
          aria-label="Undo"
        >
          <ArrowUturnLeftIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={!canRedo}
          onClick={(event) => {
            event.preventDefault()
            editor.dispatchCommand(REDO_COMMAND, undefined)
          }}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            canRedo
              ? 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
          aria-label="Redo"
        >
          <ArrowUturnRightIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center space-x-1 px-1 py-0.5">
        <button
          type="button"
          className="flex items-center justify-between p-2 rounded-md min-w-36 cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800"
          onClick={(event) => {
            event.preventDefault()
            setShowTypographyOptionsDropDown(!showTypographyOptionsDropDown)
          }}
          aria-label="Formatting Options"
        >
          <div className="flex items-center space-x-2">
            <BlockTypeIcon blockType={blockType} className="w-4 h-4" />
            <span className="text-color-label text-xs">
              {getBlockTypeToBlockName(blockType)}
            </span>
          </div>
          <ChevronDownIcon className="w-4 h-4" />
        </button>
        {showTypographyOptionsDropDown &&
          createPortal(
            <TypographyOptionsDropdownList
              editor={editor}
              blockType={blockType}
              toolbarRef={toolbarRef}
              setShowTypographyOptionsDropDown={
                setShowTypographyOptionsDropDown
              }
            />,
            document.body
          )}
      </div>
      <div className="flex items-center space-x-1 px-1">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            if (!isUlEnabled) return false
            if (!isUl) {
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
            }
          }}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            isUlEnabled
              ? isUl
                ? 'cursor-pointer text-primary-500 bg-zinc-100 dark:bg-zinc-800'
                : 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            if (!isOlEnabled) return false
            if (!isOl) {
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
            }
          }}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            isOlEnabled
              ? isOl
                ? 'cursor-pointer text-primary-500 bg-zinc-100 dark:bg-zinc-800'
                : 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"
            />
            <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            if (!isQuoteEnabled) return false
            if (!isQuote) {
              editor.update(() => {
                const selection = $getSelection()
                if ($isRangeSelection(selection)) {
                  $wrapNodes(selection, () => $createQuoteNode())
                }
              })
            } else {
              editor.update(() => {
                const selection = $getSelection()
                if ($isRangeSelection(selection)) {
                  $wrapNodes(selection, () => $createParagraphNode())
                }
              })
            }
          }}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            isQuoteEnabled
              ? isQuote
                ? 'cursor-pointer text-primary-500 bg-zinc-100 dark:bg-zinc-800'
                : 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="w-4 h-4"
          >
            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z" />
          </svg>
        </button>
      </div>
      <div className="flex items-center space-x-1 px-1">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            if (!isBoldEnable) return false
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
          }}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            isBoldEnable
              ? isBold
                ? 'cursor-pointer text-primary-500 bg-zinc-100 dark:bg-zinc-800'
                : 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
          aria-label="Format Bold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="w-4 h-4"
          >
            <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            if (!isItalicEnable) return false
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
          }}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            isItalicEnable
              ? isItalic
                ? 'cursor-pointer text-primary-500 bg-zinc-100 dark:bg-zinc-800'
                : 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
          aria-label="Format Italics"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="w-4 h-4"
          >
            <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            if (!isUnderlineEnable) return false
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
          }}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            isUnderlineEnable
              ? isUnderline
                ? 'cursor-pointer text-primary-500 bg-zinc-100 dark:bg-zinc-800'
                : 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
          aria-label="Format Underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="w-4 h-4"
          >
            <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            if (!isStrikethroughEnable) return false
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
          }}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            isStrikethroughEnable
              ? isStrikethrough
                ? 'cursor-pointer text-primary-500 bg-zinc-100 dark:bg-zinc-800'
                : 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
          aria-label="Format Strikethrough"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="w-4 h-4"
          >
            <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            if (!isCodeEnable) return false
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
          }}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            isCodeEnable
              ? isCode
                ? 'cursor-pointer text-primary-500 bg-zinc-100 dark:bg-zinc-800'
                : 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
          aria-label="Insert Code"
        >
          <CodeBracketIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            if (!isCodeBlockEnable) return false
            editor.update(() => {
              const selection = $getSelection()

              if ($isRangeSelection(selection)) {
                $wrapNodes(selection, () => $createCodeNode('plain'))
              }
            })
          }}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            isCodeBlockEnable
              ? 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
          aria-label="Insert Code Block"
        >
          <CodeBracketSquareIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={insertLink}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            isLinkEnable
              ? isLink
                ? 'cursor-pointer text-primary-500 bg-zinc-100 dark:bg-zinc-800'
                : 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
          aria-label="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        {isLink &&
          createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
      </div>
      <div className="flex items-center space-x-1 px-1">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            if (!isAlignEnable) return false
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
          }}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            isAlignEnable
              ? 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
          aria-label="Left Align"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            if (!isAlignEnable) return false
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
          }}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            isAlignEnable
              ? 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
          aria-label="Center Align"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            if (!isAlignEnable) return false
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
          }}
          className={clsx(
            'flex items-center justify-center p-2 rounded-md',
            isAlignEnable
              ? 'cursor-pointer text-color-base hover:bg-zinc-100 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed text-color-dimmed'
          )}
          aria-label="Right Align"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
