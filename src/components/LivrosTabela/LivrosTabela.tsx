// src/components/LivrosTabela/LivrosTabela.tsx

"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, PlusCircle, FilePenLine, Trash2 } from 'lucide-react';
import styles from './LivrosTabela.module.css';
import clsx from 'clsx';
import Modal from '../Modal/Modal';
import FormularioLivro from '../FormularioLivro/FormularioLivro';
import ModalConfirmacao from '../ModalConfirmacao/ModalConfirmacao';

export type Livro = {
  LIV_ID: number;
  LIV_TITULO: string;
  LIV_AUTOR: string;
  LIV_ANO: number;
  LIV_GENERO: string;
  LIV_EDITORA: string;
};

const API_BASE_URL = 'https://api.livros.g2inovartech.com.br/api';

export default function LivrosTabela() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [livroParaExcluir, setLivroParaExcluir] = useState<Livro | null>(null);
  const [livroEmFoco, setLivroEmFoco] = useState<Livro | 'novo' | null>(null);

  const fetchLivros = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/livros`);
      if (!response.ok) throw new Error(`Falha na rede: ${response.statusText}`);
      
      const responseData = await response.json();
      
      // CORREÇÃO 1: Acessa o array dentro da chave "livros"
      const livrosDaApi = responseData.livros; 
      
      if (!Array.isArray(livrosDaApi)) throw new Error("A API não retornou um array em 'livros'.");
      
      const livrosMapeados = livrosDaApi.map((item: any) => ({
        // CORREÇÃO 2: Lê 'LIV_ID' em vez de 'id'
        LIV_ID: item.LIV_ID,
        LIV_TITULO: item.LIV_TITULO,
        LIV_AUTOR: item.LIV_AUTOR,
        LIV_ANO: item.LIV_ANO_PUBLICACAO,
        LIV_GENERO: item.LIV_GENERO,
        LIV_EDITORA: item.LIV_EDITORA || '',
      }));

      setLivros(livrosMapeados);
    } catch (err: any) {
      console.error("ERRO AO BUSCAR DADOS:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLivros();
  }, [fetchLivros]);

  const handleSalvarLivro = async (dadosDoForm: Omit<Livro, 'LIV_ID'> & { LIV_ID?: number }) => {
    const dadosParaApi = {
      LIV_TITULO: dadosDoForm.LIV_TITULO,
      LIV_AUTOR: dadosDoForm.LIV_AUTOR,
      LIV_GENERO: dadosDoForm.LIV_GENERO,
      LIV_ANO_PUBLICACAO: dadosDoForm.LIV_ANO,
    };
    
    const isEditing = dadosDoForm.LIV_ID && dadosDoForm.LIV_ID > 0;
    const url = isEditing ? `${API_BASE_URL}/livros/${dadosDoForm.LIV_ID}` : `${API_BASE_URL}/livros`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosParaApi) });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || `Falha ao salvar o livro.`);
      }
      setLivroEmFoco(null);
      await fetchLivros();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleConfirmarExclusao = async () => {
    if (!livroParaExcluir || typeof livroParaExcluir.LIV_ID === 'undefined') {
      alert("Erro: ID do livro inválido.");
      return;
    };
    try {
      const response = await fetch(`${API_BASE_URL}/livros/${livroParaExcluir.LIV_ID}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao excluir o livro.');
      }
      setLivroParaExcluir(null);
      await fetchLivros();
    } catch (err: any) {
      alert(err.message);
    }
  };
  
  const livrosFiltrados = livros.filter(livro =>
    (livro.LIV_TITULO || '').toLowerCase().includes(termoBusca.toLowerCase()) ||
    (livro.LIV_AUTOR || '').toLowerCase().includes(termoBusca.toLowerCase())
  );

  if (isLoading) return <div className={styles.container}><p>Carregando livros...</p></div>;
  if (error) return <div className={styles.container}><p style={{color: 'red'}}>Erro: {error}</p></div>;

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
            <h1 className={styles.title}>Minha Coleção</h1>
            <div className={styles.actionsContainer}>
                <div className={styles.searchInputContainer}>
                    <Search className={styles.searchIcon} />
                    <input type="text" placeholder="Buscar por título ou autor..." className={styles.searchInput} value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} />
                </div>
                <button className={clsx(styles.button, styles.primary)} onClick={() => setLivroEmFoco('novo')}>
                    <PlusCircle width={20} height={20} />
                    Cadastrar Livro
                </button>
            </div>
        </header>
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr><th>Título</th><th>Autor</th><th>Gênero</th><th>Ano</th><th style={{ textAlign: 'center' }}>Ações</th></tr>
                </thead>
                <tbody>
                    {livrosFiltrados.length > 0 ? (
                        livrosFiltrados.map((livro) => (
                            <tr key={livro.LIV_ID}>
                                <td className={styles.titleCell}>{livro.LIV_TITULO}</td>
                                <td>{livro.LIV_AUTOR}</td><td>{livro.LIV_GENERO}</td><td>{livro.LIV_ANO}</td>
                                <td className={styles.actionsCell}>
                                    <button className={clsx(styles.button, styles.ghost, styles.icon)} onClick={() => setLivroEmFoco(livro)}>
                                        <FilePenLine width={20} height={20} />
                                    </button>
                                    <button className={clsx(styles.button, styles.ghost, styles.icon, styles.deleteIcon)} onClick={() => setLivroParaExcluir(livro)}>
                                        <Trash2 width={20} height={20} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum livro encontrado.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
      <Modal isOpen={livroEmFoco !== null} onClose={() => setLivroEmFoco(null)}>
        <FormularioLivro
          key={typeof livroEmFoco === 'object' && livroEmFoco?.LIV_ID || 'novo'}
          onClose={() => setLivroEmFoco(null)}
          onSubmit={handleSalvarLivro}
          livroInicial={typeof livroEmFoco === 'object' ? livroEmFoco : null}
        />
      </Modal>
      <Modal isOpen={!!livroParaExcluir} onClose={() => setLivroParaExcluir(null)}>
        {livroParaExcluir && (
          <ModalConfirmacao
            titulo="Confirmar Exclusão"
            onClose={() => setLivroParaExcluir(null)}
            onConfirm={handleConfirmarExclusao}
            confirmButtonText="Sim, excluir"
          >
            Você tem certeza que deseja excluir o livro "<strong>{livroParaExcluir.LIV_TITULO}</strong>"?
          </ModalConfirmacao>
        )}
      </Modal>
    </>
  );
}