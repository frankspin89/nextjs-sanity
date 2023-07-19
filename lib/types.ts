export type Label = {key: string; text: string}

export type Translation = {
  path: string
  language: string
  title: string
}

export type LanguageObject = {
  [key: string]: string;
}