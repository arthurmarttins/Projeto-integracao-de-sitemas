import { useState, useEffect } from 'react';
import styles from './FormularioLivro.module.css';
import clsx from 'clsx';
import buttonStyles from '../LivrosTabela/LivrosTabela.module.css';

import type { Livro } from '../LivrosTabela/LivrosTabela';
type FormularioLivroProps = {
  onClose: () => void;
  onSubmit: (livro: Omit<Livro, 'LIV_ID'> & { LIV_ID?: number }) => void; 
  livroInicial?: Livro | null; 
};

export default function FormularioLivro({ onClose, onSubmit, livroInicial }: FormularioLivroProps) {

  // 1. Criando estados internos para cada campo do formulário
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');
  const [ano, setAno] = useState<number | ''>('');

  // 2. useEffect para preencher o formulário quando estiver no modo de edição
  useEffect(() => {
    if (livroInicial) {
      setTitulo(livroInicial.LIV_TITULO);
      setAutor(livroInicial.LIV_AUTOR);
      setGenero(livroInicial.LIV_GENERO);
      setAno(livroInicial.LIV_ANO);
    } else {
      setTitulo('');
      setAutor('');
      setGenero('');
      setAno('');
    }
  }, [livroInicial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 3. Monta o objeto do livro com os dados do estado e envia para o componente pai
    onSubmit({
      LIV_ID: livroInicial?.LIV_ID, 
      LIV_TITULO: titulo,
      LIV_AUTOR: autor,
      LIV_GENERO: genero,
      LIV_ANO: Number(ano),
      LIV_EDITORA: '', // Podemos adicionar este campo depois
    });
  };

  const isEditing = !!livroInicial;

  return (
    <form onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>
        {isEditing ? 'Editar Livro' : 'Cadastrar Novo Livro'}
      </h2>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="titulo" className={styles.label}>Título</label>
          <input type="text" id="titulo" className={styles.input} required value={titulo} onChange={e => setTitulo(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="autor" className={styles.label}>Autor</label>
          <input type="text" id="autor" className={styles.input} required value={autor} onChange={e => setAutor(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="genero" className={styles.label}>Gênero</label>
          <input type="text" id="genero" className={styles.input} value={genero} onChange={e => setGenero(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="ano" className={styles.label}>Ano</label>
          <input type="number" id="ano" className={styles.input} value={ano} onChange={e => setAno(Number(e.target.value))} />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button type="button" onClick={onClose} className={clsx(buttonStyles.button, buttonStyles.ghost)}>
          Cancelar
        </button>
        <button type="submit" className={clsx(buttonStyles.button, buttonStyles.primary)}>
          Salvar
        </button>
      </div>
    </form>
  );
}