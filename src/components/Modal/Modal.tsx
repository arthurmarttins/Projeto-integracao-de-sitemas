// src/components/Modal.tsx

import styles from './Modal.module.css';
import clsx from 'clsx';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={clsx(styles.overlay, isOpen && styles.overlayVisible)}
      onClick={onClose}
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}