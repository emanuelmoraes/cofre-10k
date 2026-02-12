# 📱 Guia de Publicação - Google Play Store
## Cofre 10k - Documentação Auxiliar

Este documento fornece um guia passo-a-passo completo para publicar o aplicativo Cofre 10k no Google Play Store usando Expo e EAS Build.

---

## 📋 **Pré-requisitos**

### ✅ **Conta e Ferramentas**
- [ ] Conta Google Play Console ativa ($25 taxa única)
- [ ] Conta Expo com EAS configurado
- [ ] Android Studio instalado (para testing local)
- [ ] Java Development Kit (JDK) 11 ou superior
- [ ] Node.js 18+ e npm/yarn

### ✅ **Preparação do Projeto**
- [ ] Aplicativo funcionando corretamente
- [ ] Testes em dispositivos Android realizados
- [ ] Ícones e splash screens criados
- [ ] Versioning configurado

### ✅ **Checklist rápido de release (recomendado)**
```bash
# 1) Validar projeto antes do build
npm run release:check

# 2) Gerar AAB de produção
npm run release:android
```

Observação: esse fluxo mantém exatamente seu processo atual de publicação,
adicionando apenas validações para reduzir retrabalho.

---

## 🔧 **Etapa 1: Configuração do EAS**

### 1.1 Instalar EAS CLI
```bash
npm install -g eas-cli
```

### 1.2 Login no Expo
```bash
eas login
```

### 1.3 Inicializar EAS no projeto
```bash
cd cofre-10k
eas build:configure
```

### 1.4 Configurar `eas.json`
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

---

## 🎨 **Etapa 2: Preparação de Assets**

### 2.1 Ícones do App
Criar os seguintes ícones em `assets/images/`:
- **icon.png** - 1024x1024px (ícone principal)
- **adaptive-icon.png** - 1024x1024px (Android adaptive)
- **favicon.png** - 48x48px (web favicon)

### 2.2 Splash Screen
- **splash-icon.png** - 1284x2778px (tela de carregamento)

### 2.3 Screenshots para Play Store
Preparar screenshots em diferentes tamanhos:
- **Telefone:** 16:9 ou 9:16 ratio, mínimo 320px
- **Tablet 7":** 1024x600px ou similar
- **Tablet 10":** 1920x1200px ou similar

**Dica:** Capture screenshots das principais telas:
- Tela inicial com progresso
- Tabuleiro de depósitos
- Modal de confirmação
- Tema claro e escuro

---

## 📝 **Etapa 3: Configuração do app.json**

### 3.1 Atualizar configurações
```json
{
  "expo": {
    "name": "Cofre 10k",
    "slug": "cofre-10k",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "automatic",
    "scheme": "cofre10k",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#fafafa"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "android": {
      "package": "com.emanuelmoraes.cofre10k",
      "versionCode": 1,
      "compileSdkVersion": 34,
      "targetSdkVersion": 34,
      "buildToolsVersion": "34.0.0",
      "icon": "./assets/images/icon.png",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#fafafa"
      },
      "permissions": [
        "WRITE_EXTERNAL_STORAGE"
      ],
      "blockedPermissions": [
        "RECORD_AUDIO"
      ]
    },
    "plugins": [
      "expo-router",
      [
        "expo-font",
        {
          "fonts": ["./assets/fonts/SpaceMono-Regular.ttf"]
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "SEU_PROJECT_ID_AQUI"
      }
    }
  }
}
```

### 3.2 Definir informações importantes
- **package:** Nome único da aplicação (ex: `com.emanuelmoraes.cofre10k`)
- **versionCode:** Número da versão (incrementar a cada release)
- **version:** Versão legível (ex: "1.0.0", "1.0.1")

---

## 🔐 **Etapa 4: Assinatura Digital**

### 4.1 Gerar Keystore (Opção Manual)
```bash
# Gerar keystore local (opcional - EAS pode gerenciar)
keytool -genkeypair -v -keystore cofre10k-release-key.keystore -alias cofre10k -keyalg RSA -keysize 2048 -validity 10000
```

### 4.2 Configurar Credentials EAS (Recomendado)
```bash
# EAS gerencia automaticamente as credenciais
eas credentials
```

**Vantagens do EAS Credentials:**
- Gerenciamento automático
- Backup seguro na nuvem
- Rotação de chaves simplificada
- Sincronização entre desenvolvedores

---

## 🏗️ **Etapa 5: Build para Produção**

### 5.1 Build de Teste (APK)
```bash
# Build de preview para testes
eas build --platform android --profile preview
```

### 5.2 Build de Produção (AAB)
```bash
# Build para Google Play Store
eas build --platform android --profile production
```

Alternativa com validação automática antes do build:
```bash
npm run release:android
```

### 5.3 Monitorar Build
- Acompanhe o progresso em: https://expo.dev/builds
- O build pode levar 10-20 minutos
- Download automático após conclusão

### 5.4 Teste Local
```bash
# Instalar APK no dispositivo para testes
adb install caminho/para/app.apk
```

---

## 🏪 **Etapa 6: Google Play Console**

### 6.1 Criar Nova Aplicação
1. Acesse [Google Play Console](https://play.google.com/console/)
2. Clique em "Criar app"
3. Preencha:
   - **Nome do app:** "Cofre 10k"
   - **Idioma padrão:** Português (Brasil)
   - **Tipo:** App ou jogo
   - **Categoria:** Finanças
   - **Gratuito/Pago:** Gratuito

### 6.2 Configurar Informações da Loja
```
Título: Cofre 10k - Controle Financeiro
Descrição curta (80 chars): Gerencie seus depósitos e alcance a meta de R$10.000 com facilidade.

Descrição completa:
🎯 Transforme sua meta financeira em realidade!

O Cofre 10k é um aplicativo intuitivo que te ajuda a acompanhar e gerenciar seus depósitos até alcançar a meta de R$10.000. Inspirado no conceito tradicional do cofre físico, oferece uma experiência digital moderna e motivadora.

✨ FUNCIONALIDADES PRINCIPAIS:
• Tabuleiro interativo com valores de R$5 a R$200
• Acompanhamento visual do progresso em tempo real
• Interface Material Design com temas claro e escuro
• Histórico completo de todos os depósitos
• Sistema seguro de backup local
• Reset com confirmação para recomeçar

🎨 DESIGN MODERNO:
• Material Design 3 nativo
• Animações suaves e responsivas
• Alternância automática de tema
• Interface minimalista e intuitiva

💾 SEGURANÇA:
• Dados salvos localmente no dispositivo
• Backup automático de todas as operações
• Sem necessidade de conta ou login

Ideal para quem busca disciplina financeira e quer transformar o hábito de poupar em algo visual e motivador!
```

### 6.3 Adicionar Assets Visuais
- **Ícone:** 512x512px (PNG/JPEG)
- **Imagem destacada:** 1024x500px
- **Screenshots:** Mínimo 2, máximo 8 por tipo de dispositivo
- **Vídeo promocional:** (Opcional) máximo 30 segundos

### 6.4 Categorização
- **Categoria:** Finanças
- **Tags:** poupança, controle financeiro, meta, depósitos
- **Classificação de conteúdo:** Livre para todos

---

## 📤 **Etapa 7: Upload e Submissão**

### 7.1 Upload Manual do AAB
1. No Play Console, vá para "Produção"
2. Clique em "Criar nova versão"
3. Upload do arquivo `.aab` gerado pelo EAS
4. Preencher "Notas da versão":
```
🎉 Primeira versão do Cofre 10k!

• Interface Material Design 3 moderna
• Temas claro e escuro
• Tabuleiro interativo de depósitos
• Acompanhamento de progresso em tempo real
• Sistema de backup automático
• Modal de confirmação para reset

Esta versão estabelece a base sólida para o controle financeiro pessoal.
```

### 7.2 Upload via EAS Submit (Automatizado)
```bash
# Configurar service account primeiro
eas submit --platform android
```

### 7.3 Configurar Service Account (Para EAS Submit)
1. Google Cloud Console → Criar Service Account
2. Download da chave JSON
3. Salvar como `google-service-account.json`
4. Adicionar no `.gitignore`

---

## ✅ **Etapa 8: Revisão e Publicação**

### 8.1 Política de Conteúdo
Verificar conformidade com:
- **Política de Dados do Usuário:** Não coleta dados pessoais
- **Política de Permissões:** Apenas armazenamento local
- **Política de Funcionalidade:** App funciona como descrito
- **Política de Metadados:** Informações precisas

### 8.2 Teste de Versão Interna
1. Criar "Versão interna" primeiro
2. Adicionar testadores (emails)
3. Verificar funcionamento completo
4. Coletar feedback antes da publicação

### 8.3 Submissão para Revisão
1. Revisar todas as informações
2. Clicar em "Enviar para revisão"
3. Aguardar aprovação (1-3 dias úteis)

### 8.4 Acompanhar Status
- **Em análise:** Google está revisando
- **Aprovado:** Disponível na loja
- **Rejeitado:** Verificar motivos e corrigir

---

## 🔄 **Etapa 9: Atualizações Futuras**

### 9.1 Versionamento
```json
{
  "version": "1.0.1",        // Versão legível
  "android": {
    "versionCode": 2         // Incrementar sempre
  }
}
```

### 9.2 Processo de Atualização
```bash
# 1. Atualizar código
# 2. Incrementar versionCode
# 3. Build nova versão
eas build --platform android --profile production

# 4. Submit atualização
eas submit --platform android
```

### 9.3 Rollout Gradual
- Iniciar com 5% dos usuários
- Monitorar crashes e feedback
- Aumentar gradualmente para 100%

---

## 📊 **Etapa 10: Monitoramento**

### 10.1 Métricas Importantes
- **Downloads:** Crescimento de instalações
- **Avaliações:** Feedback dos usuários
- **Crashes:** Estabilidade da aplicação
- **Desinstalações:** Taxa de retenção

### 10.2 Ferramentas de Análise
- **Google Play Console:** Estatísticas oficiais
- **Expo Analytics:** Dados de uso
- **Crashlytics:** Relatórios de erro (se configurado)

### 10.3 Resposta a Avaliações
- Responder reviews negativos construtivamente
- Agradecer feedback positivo
- Usar sugestões para melhorias futuras

---

## 🚨 **Troubleshooting Comum**

### ❌ **Build Falhando**
```bash
# Limpar cache
expo r -c
npm install

# Verificar configurações
eas build:configure
```

### ❌ **Erro de Assinatura**
```bash
# Resetar credenciais
eas credentials --clear-android-keystore
eas credentials --clear-android-signing-credentials
```

### ❌ **Rejeição na Play Store**
- Verificar políticas de conteúdo
- Corrigir metadados imprecisos
- Resolver problemas de permissões
- Adicionar declaração de privacidade se necessário

### ❌ **App Crashing**
- Testar build em dispositivos físicos
- Verificar logs com `adb logcat`
- Usar Expo debugging tools

---

## 📋 **Checklist Final**

### ✅ **Antes da Primeira Submissão**
- [ ] App testado em múltiplos dispositivos Android
- [ ] Screenshots de qualidade preparados
- [ ] Descrição e metadados revisados
- [ ] Ícones em todas as resoluções criados
- [ ] Versionamento configurado corretamente
- [ ] Build de produção gerado com sucesso
- [ ] Conformidade com políticas verificada

### ✅ **Após Publicação**
- [ ] Monitorar reviews e ratings
- [ ] Acompanhar métricas de download
- [ ] Responder feedback dos usuários
- [ ] Planejar próximas atualizações
- [ ] Backup das credenciais de assinatura

---

## 📝 **Notas Importantes**

### 💰 **Custos**
- **Google Play Console:** $25 (taxa única, vitalícia)
- **EAS Build:** Plano gratuito disponível (limitado)
- **Domínio personalizado:** Opcional

### ⏱️ **Tempos Estimados**
- **Configuração inicial:** 2-4 horas
- **Preparação de assets:** 1-2 horas
- **Build EAS:** 15-30 minutos
- **Revisão Google Play:** 1-3 dias úteis
- **Atualizações futuras:** 30-60 minutos

### 🔒 **Segurança**
- Nunca commitar chaves privadas no Git
- Usar EAS Credentials para gerenciamento automático
- Manter backup das credenciais importantes
- Revisar permissões solicitadas regularmente

---

## 🎯 **Próximos Passos Recomendados**

1. **Implementar Analytics:** Para entender uso real
2. **Adicionar Crash Reporting:** Para debugging remoto
3. **Criar Landing Page:** Para marketing do app
4. **Internationalization:** Suporte a múltiplos idiomas
5. **Store Optimization:** Melhorar ranking na loja

---

**📚 Documentação criada em:** Setembro 2025  
**🔄 Última atualização:** Versão 1.0  
**👨‍💻 Projeto:** Cofre 10k - Emanuel Moraes  

*Esta documentação serve como guia completo e pode ser consultada a qualquer momento durante o processo de publicação e manutenção do aplicativo no Google Play Store.*
