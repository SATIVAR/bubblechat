import { WordTokenizer, PorterStemmer, stopwords } from 'natural';
import { compareTwoStrings } from 'string-similarity';

export interface PreprocessingOptions {
  removeStopwords?: boolean;
  applyStemming?: boolean;
  normalizeWhitespace?: boolean;
  removeSpecialChars?: boolean;
  minWordLength?: number;
  language?: 'portuguese' | 'english';
}

export class TextPreprocessor {
  private static readonly DEFAULT_OPTIONS: PreprocessingOptions = {
    removeStopwords: true,
    applyStemming: false,
    normalizeWhitespace: true,
    removeSpecialChars: false,
    minWordLength: 2,
    language: 'portuguese'
  };

  // Stopwords em português
  private static readonly PORTUGUESE_STOPWORDS = new Set([
    'a', 'ao', 'aos', 'aquela', 'aquelas', 'aquele', 'aqueles', 'aquilo',
    'as', 'até', 'com', 'como', 'da', 'das', 'de', 'dela', 'delas', 'dele',
    'deles', 'depois', 'do', 'dos', 'e', 'ela', 'elas', 'ele', 'eles', 'em',
    'entre', 'era', 'eram', 'essa', 'essas', 'esse', 'esses', 'esta', 'estamos',
    'estas', 'estava', 'estavam', 'este', 'esteja', 'estejam', 'estejamos',
    'estes', 'esteve', 'estive', 'estivemos', 'estiver', 'estivera', 'estiveram',
    'estiverem', 'estivermos', 'estivesse', 'estivessem', 'estivéramos',
    'estivéssemos', 'estou', 'está', 'estávamos', 'estão', 'eu', 'foi', 'fomos',
    'for', 'fora', 'foram', 'forem', 'formos', 'fosse', 'fossem', 'fui',
    'fôramos', 'fôssemos', 'haja', 'hajam', 'hajamos', 'havemos', 'havia',
    'hei', 'houve', 'houvemos', 'houver', 'houvera', 'houveram', 'houverei',
    'houverem', 'houveremos', 'houveria', 'houveriam', 'houveríamos', 'houvermos',
    'houvesse', 'houvessem', 'houvéramos', 'houvéssemos', 'há', 'hão', 'isso',
    'isto', 'já', 'lhe', 'lhes', 'mais', 'mas', 'me', 'mesmo', 'meu', 'meus',
    'minha', 'minhas', 'muito', 'na', 'nas', 'nem', 'no', 'nos', 'nossa',
    'nossas', 'nosso', 'nossos', 'num', 'numa', 'não', 'nós', 'o', 'os',
    'ou', 'para', 'pela', 'pelas', 'pelo', 'pelos', 'por', 'qual', 'quando',
    'que', 'quem', 'se', 'seja', 'sejam', 'sejamos', 'sem', 'ser', 'seria',
    'seriam', 'será', 'serão', 'seríamos', 'seu', 'seus', 'só', 'sua', 'suas',
    'são', 'também', 'te', 'tem', 'temos', 'tenha', 'tenham', 'tenhamos',
    'tenho', 'ter', 'terei', 'teremos', 'teria', 'teriam', 'teríamos', 'teu',
    'teus', 'teve', 'tinha', 'tinham', 'tive', 'tivemos', 'tiver', 'tivera',
    'tiveram', 'tiverem', 'tivermos', 'tivesse', 'tivessem', 'tivéramos',
    'tivéssemos', 'tu', 'tua', 'tuas', 'tém', 'tínhamos', 'um', 'uma', 'você',
    'vocês', 'vos', 'à', 'às', 'éramos'
  ]);

  static preprocess(text: string, options: PreprocessingOptions = {}): string {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    let processedText = text;

    // Normalizar espaços em branco
    if (opts.normalizeWhitespace) {
      processedText = this.normalizeWhitespace(processedText);
    }

    // Remover caracteres especiais se solicitado
    if (opts.removeSpecialChars) {
      processedText = this.removeSpecialCharacters(processedText);
    }

    // Tokenizar
    const tokenizer = new WordTokenizer();
    let tokens = tokenizer.tokenize(processedText) || [];

    // Filtrar por tamanho mínimo
    if (opts.minWordLength && opts.minWordLength > 0) {
      tokens = tokens.filter(token => token.length >= opts.minWordLength!);
    }

    // Remover stopwords
    if (opts.removeStopwords) {
      tokens = this.removeStopwords(tokens, opts.language || 'portuguese');
    }

    // Aplicar stemming
    if (opts.applyStemming) {
      tokens = tokens.map(token => PorterStemmer.stem(token));
    }

    return tokens.join(' ');
  }

  private static normalizeWhitespace(text: string): string {
    return text
      // Substituir múltiplos espaços por um único espaço
      .replace(/\s+/g, ' ')
      // Remover espaços no início e fim
      .trim()
      // Normalizar quebras de linha
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remover múltiplas quebras de linha
      .replace(/\n{3,}/g, '\n\n');
  }

  private static removeSpecialCharacters(text: string): string {
    // Manter apenas letras, números, espaços e pontuação básica
    return text.replace(/[^\w\s.,;:!?()[\]{}"'-]/g, ' ');
  }

  private static removeStopwords(tokens: string[], language: string): string[] {
    const stopwordSet = language === 'portuguese' 
      ? this.PORTUGUESE_STOPWORDS 
      : new Set(stopwords);

    return tokens.filter(token => 
      !stopwordSet.has(token.toLowerCase())
    );
  }

  static extractKeywords(text: string, maxKeywords: number = 10): string[] {
    // Pré-processar texto
    const processed = this.preprocess(text, {
      removeStopwords: true,
      normalizeWhitespace: true,
      minWordLength: 3
    });

    // Tokenizar
    const tokenizer = new WordTokenizer();
    const tokens = tokenizer.tokenize(processed.toLowerCase()) || [];

    // Contar frequência
    const frequency: { [key: string]: number } = {};
    tokens.forEach(token => {
      frequency[token] = (frequency[token] || 0) + 1;
    });

    // Ordenar por frequência e retornar top keywords
    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }

  static calculateSimilarity(text1: string, text2: string): number {
    const processed1 = this.preprocess(text1);
    const processed2 = this.preprocess(text2);
    
    return compareTwoStrings(processed1, processed2);
  }

  static summarizeText(text: string, maxSentences: number = 3): string {
    // Dividir em sentenças
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length <= maxSentences) {
      return text;
    }

    // Calcular pontuação de cada sentença baseada em palavras-chave
    const keywords = this.extractKeywords(text, 20);
    const keywordSet = new Set(keywords);

    const sentenceScores = sentences.map(sentence => {
      const words = sentence.toLowerCase().split(/\s+/);
      const score = words.reduce((acc, word) => {
        return acc + (keywordSet.has(word) ? 1 : 0);
      }, 0);
      
      return { sentence: sentence.trim(), score };
    });

    // Ordenar por pontuação e pegar as melhores
    const topSentences = sentenceScores
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSentences)
      .map(item => item.sentence);

    return topSentences.join('. ') + '.';
  }

  static formatForLLM(text: string): string {
    // Formatação específica para envio ao LLM
    const processed = this.preprocess(text, {
      removeStopwords: false, // Manter stopwords para contexto
      normalizeWhitespace: true,
      removeSpecialChars: false,
      minWordLength: 1
    });

    // Adicionar estrutura se o texto for muito longo
    if (processed.length > 2000) {
      const summary = this.summarizeText(processed, 5);
      const keywords = this.extractKeywords(processed, 15);
      
      return `RESUMO: ${summary}\n\nPALAVRAS-CHAVE: ${keywords.join(', ')}\n\nTEXTO COMPLETO:\n${processed}`;
    }

    return processed;
  }
}