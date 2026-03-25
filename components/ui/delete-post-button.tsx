'use client'

import { useRef, useState } from 'react'
import { ConfirmModal } from '@/components/ui/confirm-modal'

interface DeletePostButtonProps {
  label: string
  className?: string
}

export function DeletePostButton({ label, className = '' }: DeletePostButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const closeModal = () => setIsOpen(false)

  const confirmDelete = () => {
    const form = buttonRef.current?.closest('form') as HTMLFormElement | null
    setIsOpen(false)
    form?.requestSubmit()
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={className}
        onClick={() => setIsOpen(true)}
      >
        {label}
      </button>
      <ConfirmModal
        isOpen={isOpen}
        title="Удалить пост"
        message="Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить."
        cancelLabel="Отмена"
        confirmLabel="Удалить"
        onCancel={closeModal}
        onConfirm={confirmDelete}
      />
    </>
  )
}
