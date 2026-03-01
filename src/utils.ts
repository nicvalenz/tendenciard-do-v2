
export const handleShare = async (title: string, text: string, slug?: string) => {
  const publicUrl = slug 
    ? `${window.location.origin}/noticia/${slug}`
    : window.location.href;
  
  const shareText = `${title}\n${text}\n${publicUrl}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: publicUrl,
      });
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  } else {
    // Fallback: WhatsApp or Copy to clipboard
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  }
};
