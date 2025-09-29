import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import ImageGenerationProgress from "@/components/ImageGenerationProgress";
import { useState } from "react";
import { 
  Instagram, 
  Linkedin,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Settings,
  Check,
  Play,
  Image,
  MessageCircle,
  Facebook,
  Twitter,
  Youtube,
  Phone,
  Hash
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreatePost = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [postContent, setPostContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPost, setGeneratedPost] = useState<any>(null);
  const [imageGenerationProgress, setImageGenerationProgress] = useState({
    currentStep: 0,
    totalSteps: 0,
    estimatedTime: "2-3 minutos",
    currentPrompt: ""
  });

  const totalSteps = 4;

  const networks = [
    { 
      id: "instagram", 
      name: "Instagram", 
      icon: Instagram, 
      description: "Posts, Stories e Reels",
      color: "from-pink-500 to-purple-600"
    },
    { 
      id: "linkedin", 
      name: "LinkedIn", 
      icon: Linkedin, 
      description: "Posts profissionais",
      color: "from-blue-600 to-blue-800"
    },
    { 
      id: "tiktok", 
      name: "TikTok", 
      icon: MessageCircle, 
      description: "Vídeos curtos",
      color: "from-gray-800 to-black"
    },
    { 
      id: "facebook", 
      name: "Facebook", 
      icon: Facebook, 
      description: "Posts e Stories",
      color: "from-blue-500 to-blue-700"
    },
    { 
      id: "twitter", 
      name: "X (Twitter)", 
      icon: Twitter, 
      description: "Tweets e threads",
      color: "from-gray-700 to-black"
    },
    { 
      id: "youtube", 
      name: "YouTube", 
      icon: Youtube, 
      description: "Shorts e posts",
      color: "from-red-500 to-red-700"
    },
    { 
      id: "whatsapp", 
      name: "WhatsApp", 
      icon: Phone, 
      description: "Status e mensagens",
      color: "from-green-500 to-green-700"
    },
    { 
      id: "pinterest", 
      name: "Pinterest", 
      icon: Image, 
      description: "Pins e boards",
      color: "from-red-400 to-pink-500"
    },
    { 
      id: "threads", 
      name: "Threads", 
      icon: Hash, 
      description: "Posts em threads",
      color: "from-purple-500 to-indigo-600"
    },
  ];

  const templates = {
    instagram: [
      { 
        id: "ig-post", 
        name: "Post Feed", 
        icon: Image, 
        description: "Post clássico do Instagram"
      },
      { 
        id: "ig-stories", 
        name: "Stories", 
        icon: Play, 
        description: "Stories verticais interativos"
      }
    ],
    linkedin: [
      { 
        id: "li-post", 
        name: "Post Profissional", 
        icon: Image, 
        description: "Post empresarial otimizado"
      }
    ],
    tiktok: [
      { 
        id: "tt-video", 
        name: "Vídeo Viral", 
        icon: Play, 
        description: "Vídeo curto e envolvente"
      }
    ],
    facebook: [
      { 
        id: "fb-post", 
        name: "Post Feed", 
        icon: Image, 
        description: "Post para timeline do Facebook"
      },
      { 
        id: "fb-story", 
        name: "Story", 
        icon: Play, 
        description: "Story vertical temporário"
      }
    ],
    twitter: [
      { 
        id: "tw-tweet", 
        name: "Tweet", 
        icon: MessageCircle, 
        description: "Tweet simples e direto"
      },
      { 
        id: "tw-thread", 
        name: "Thread", 
        icon: Hash, 
        description: "Sequência de tweets conectados"
      }
    ],
    youtube: [
      { 
        id: "yt-short", 
        name: "YouTube Short", 
        icon: Play, 
        description: "Vídeo vertical curto"
      },
      { 
        id: "yt-post", 
        name: "Post Comunidade", 
        icon: Image, 
        description: "Post na aba Comunidade"
      }
    ],
    whatsapp: [
      { 
        id: "wa-status", 
        name: "Status", 
        icon: Play, 
        description: "Status temporário"
      }
    ],
    pinterest: [
      { 
        id: "pin-image", 
        name: "Pin Imagem", 
        icon: Image, 
        description: "Pin com imagem atrativa"
      },
      { 
        id: "pin-video", 
        name: "Pin Vídeo", 
        icon: Play, 
        description: "Pin com vídeo dinâmico"
      }
    ],
    threads: [
      { 
        id: "th-post", 
        name: "Post Thread", 
        icon: MessageCircle, 
        description: "Post simples no Threads"
      },
      { 
        id: "th-thread", 
        name: "Thread Longa", 
        icon: Hash, 
        description: "Sequência de posts conectados"
      }
    ]
  };

  const getTemplatesForNetwork = (networkId: string) => {
    return templates[networkId as keyof typeof templates] || [];
  };

  const contentExamples = [
    "Lançamento do novo produto revolucionário da nossa empresa",
    "Dica rápida para aumentar sua produtividade no trabalho",
    "Promoção especial de final de ano - descontos imperdíveis",
    "Por trás das cenas: como criamos nossos produtos"
  ];

  const generateContent = async () => {
    if (!selectedNetwork || !selectedTemplate || !postContent) {
      toast.error("Preencha todas as informações antes de gerar o conteúdo");
      return;
    }

    setIsGenerating(true);
    
    // Simular progresso da geração de imagens
    setImageGenerationProgress({
      currentStep: 1,
      totalSteps: 3,
      estimatedTime: "2-3 minutos",
      currentPrompt: "Preparando geração de imagens..."
    });

    try {
      console.log('Calling generate-post-content with:', {
        network: selectedNetwork,
        template: selectedTemplate,
        content: postContent,
        objective: "Criar conteúdo engajante"
      });

      // Simular progresso durante a geração
      const progressInterval = setInterval(() => {
        setImageGenerationProgress(prev => {
          if (prev.currentStep < prev.totalSteps) {
            return {
              ...prev,
              currentStep: prev.currentStep + 1,
              currentPrompt: `Gerando imagem ${prev.currentStep + 1} de ${prev.totalSteps}...`
            };
          }
          return prev;
        });
      }, 15000); // Atualizar a cada 15 segundos

      const { data, error } = await supabase.functions.invoke('generate-post-content', {
        body: {
          network: selectedNetwork,
          template: selectedTemplate,
          content: postContent,
          objective: "Criar conteúdo engajante",
          theme: postContent,
          model: 'gpt-4o-mini', // Usar GPT-4o-mini como fallback por padrão
          generateImages: true,
          generateCaption: true,
          generateHashtags: true
        }
      });

      clearInterval(progressInterval);

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        toast.error(`Erro na função: ${error.message || 'Erro desconhecido'}`);
        return;
      }

      // Check for model ID error and retry with fallback model
      if (data && !data.success && data.error && data.error.includes('not a valid model ID')) {
        console.warn('Model ID error detected, retrying with gpt-4o-mini fallback...');
        
        const { data: retryData, error: retryError } = await supabase.functions.invoke('generate-post-content', {
          body: {
            network: selectedNetwork,
            template: selectedTemplate,
            content: postContent,
            objective: "Criar conteúdo engajante",
            theme: postContent,
            model: 'gpt-4o-mini', // Force fallback model
            generateImages: true,
            generateCaption: true,
            generateHashtags: true
          }
        });

        if (retryError) {
          console.error('Retry also failed:', retryError);
          toast.error(`Erro no fallback: ${retryError.message || 'Erro desconhecido'}`);
          return;
        }

        if (retryData && retryData.success) {
          const normalizedRetryData = {
            caption: retryData.content?.caption,
            hashtags: retryData.content?.hashtags,
            generated_images: retryData.images || [],
            model_used: retryData.metadata?.model_used,
          };

          setGeneratedPost(normalizedRetryData);
          setCurrentStep(4);
          toast.success("Conteúdo gerado com modelo de fallback!");
          return;
        }
      }

      if (!data) {
        console.error('No data returned from function');
        toast.error("Nenhum dado retornado pela função");
        return;
      }

      // Handle both success and error responses with fallback content
      if (data.success === false && data.fallback_content) {
        console.warn('Using fallback content due to API issues:', data.error);
        
        // Normalize fallback data structure
        const normalizedFallback = {
          caption: data.fallback_content.caption,
          hashtags: data.fallback_content.hashtags,
          generated_images: [],
          model_used: 'fallback',
        };
        
        setGeneratedPost(normalizedFallback);
        setCurrentStep(4);
        toast.warning(`Conteúdo gerado com limitações: ${data.error}`);
        return;
      }

      if (!data.success) {
        console.error('AI generation failed:', data);
        toast.error(`Erro na IA: ${data.error || "Falha na geração de conteúdo"}`);
        return;
      }

      // Normalize successful response data structure
      const normalizedData = {
        caption: data.content?.caption,
        hashtags: data.content?.hashtags,
        generated_images: data.images || [],
        model_used: data.metadata?.model_used,
      };

      setGeneratedPost(normalizedData);
      setCurrentStep(4);
      
      // Show better feedback about generated content
      const imageCount = data.images?.length || 0;
      const processingTime = data.metadata?.total_processing_time || 0;
      
      if (imageCount > 0) {
        toast.success(`✅ Conteúdo gerado com ${imageCount} imagens! (${Math.round(processingTime/1000)}s)`);
      } else {
        toast.success(`✅ Conteúdo gerado! Imagens não disponíveis no momento. (${Math.round(processingTime/1000)}s)`);
      }
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error(`Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsGenerating(false);
      setImageGenerationProgress({ currentStep: 0, totalSteps: 0, estimatedTime: "", currentPrompt: "" });
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedStep1 = selectedNetwork;
  const canProceedStep2 = selectedTemplate;
  const canProceedStep3 = postContent.length >= 10;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header com Progresso */}
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Criar Post</h1>
          <p className="text-muted-foreground">
            Crie conteúdo profissional em 4 passos simples
          </p>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Passo {currentStep}</span>
            <span>{totalSteps} passos</span>
          </div>
        </div>
      </div>

      {/* Passo 1: Escolha da Rede Social */}
      {currentStep === 1 && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Escolha a rede social</CardTitle>
            <CardDescription>
              Onde você quer publicar seu conteúdo?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {networks.map((network) => (
                <div
                  key={network.id}
                  onClick={() => setSelectedNetwork(network.id)}
                  className={`
                    group p-6 rounded-xl border-2 cursor-pointer transition-smooth hover:scale-105
                    ${selectedNetwork === network.id 
                      ? 'border-primary bg-primary/5 shadow-card' 
                      : 'border-border hover:border-primary/30'
                    }
                  `}
                >
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${network.color} flex items-center justify-center mx-auto`}>
                      <network.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{network.name}</h3>
                      <p className="text-sm text-muted-foreground">{network.description}</p>
                    </div>
                    {selectedNetwork === network.id && (
                      <div className="flex justify-center">
                        <Badge className="bg-primary">Selecionado</Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {canProceedStep1 && (
              <div className="flex justify-center mt-6">
                <Button onClick={nextStep} size="lg" className="px-8">
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Passo 2: Escolha do Template */}
      {currentStep === 2 && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Escolha o formato</CardTitle>
            <CardDescription>
              Que tipo de conteúdo você quer criar para o {networks.find(n => n.id === selectedNetwork)?.name}?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getTemplatesForNetwork(selectedNetwork).map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`
                    group p-6 rounded-xl border-2 cursor-pointer transition-smooth hover:scale-105
                    ${selectedTemplate === template.id 
                      ? 'border-primary bg-primary/5 shadow-card' 
                      : 'border-border hover:border-primary/30'
                    }
                  `}
                >
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto">
                      <template.icon className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="flex justify-center">
                        <Badge className="bg-primary">Selecionado</Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-6">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              {canProceedStep2 && (
                <Button onClick={nextStep} size="lg">
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Passo 3: Conteúdo */}
      {currentStep === 3 && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Conte-nos sobre seu post</CardTitle>
            <CardDescription>
              Descreva o que você quer comunicar. Nossa IA criará o conteúdo perfeito!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Textarea
                placeholder="Ex: Quero promover o lançamento do nosso novo produto..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="min-h-[120px] resize-none text-base"
              />
              <p className="text-sm text-muted-foreground">
                Seja específico para obter melhores resultados (mín. 10 caracteres)
              </p>
            </div>

            {/* Exemplos */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Precisa de inspiração?</p>
              <div className="grid gap-2">
                {contentExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPostContent(example)}
                    className="text-left p-3 rounded-lg bg-muted/30 hover:bg-muted transition-smooth text-sm border border-transparent hover:border-border"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              {canProceedStep3 && (
                <Button 
                  onClick={generateContent}
                  disabled={isGenerating}
                  size="lg"
                  className="gradient-primary"
                >
                  {isGenerating ? (
                    <>
                      <Settings className="h-4 w-4 mr-2 animate-spin" />
                      <span className="flex flex-col items-start">
                        <span>Gerando conteúdo...</span>
                        <span className="text-xs opacity-75">
                          Legendas, hashtags e imagens (30-60s)
                        </span>
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Gerar Post
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progresso da Geração de Imagens */}
      {isGenerating && (
        <ImageGenerationProgress
          isGenerating={isGenerating}
          currentStep={imageGenerationProgress.currentStep}
          totalSteps={imageGenerationProgress.totalSteps}
          estimatedTime={imageGenerationProgress.estimatedTime}
          currentImagePrompt={imageGenerationProgress.currentPrompt}
        />
      )}

      {/* Passo 4: Resultado */}
      {currentStep === 4 && generatedPost && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Check className="h-6 w-6 text-green-500" />
              Conteúdo Gerado com Sucesso!
            </CardTitle>
            <CardDescription>
              Seu post está pronto para ser publicado no {networks.find(n => n.id === selectedNetwork)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Caption */}
            {generatedPost.caption && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Legenda:</h3>
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedPost.caption}
                  </p>
                </div>
              </div>
            )}

            {/* Hashtags */}
            {generatedPost.hashtags && generatedPost.hashtags.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Hashtags:</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedPost.hashtags.map((hashtag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {hashtag.startsWith('#') ? hashtag : `#${hashtag}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Images */}
            {generatedPost.generated_images && generatedPost.generated_images.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Imagens Geradas:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedPost.generated_images.map((image: any, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-shadow"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Model Info */}
            {generatedPost.model_used && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Gerado com {generatedPost.model_used}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-4">
              <Button onClick={() => setCurrentStep(1)} variant="outline">
                Criar Novo Post
              </Button>
              <div className="flex gap-3">
                <Button variant="outline">
                  Salvar Rascunho
                </Button>
                <Button className="gradient-primary">
                  Publicar Agora
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreatePost;