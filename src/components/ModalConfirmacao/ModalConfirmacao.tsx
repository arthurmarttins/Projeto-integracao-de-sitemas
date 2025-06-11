import styles from './ModalConfirmacao.module.css';
import clsx from 'clsx';
import buttonStyles from '../LivrosTabela/LivrosTabela.module.css';

type ModalConfirmacaoProps = {
  titulo: string;
  children: React.ReactNode; // A mensagem de confirmação virá aqui
  onClose: () => void;
  onConfirm: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
};

export default function ModalConfirmacao({
  titulo,
  children,
  onClose,
  onConfirm,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar"
}: ModalConfirmacaoProps) {
  return (
    <div>
      <h2 className={styles.title}>{titulo}</h2>
      <p className={styles.message}>
        {children}
      </p>
      <div className={styles.buttonContainer}>
        <button
          type="button"
          onClick={onClose}
          className={clsx(buttonStyles.button, buttonStyles.ghost)}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={clsx(buttonStyles.button, buttonStyles.primary)}
          style={{ backgroundColor: 'var(--cor-vermelho)' }}
          onClick={onConfirm}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}