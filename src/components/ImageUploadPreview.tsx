import React, { useRef, useState } from 'react';
import { FaDownload, FaPencilAlt } from 'react-icons/fa';
import { Box, Button, Flex, Image } from '@chakra-ui/react';

import { useI18n } from '@/locales/client';

interface ImageUploadPreviewProps {
  onFileSelect: (file: File) => void;
  image?: string;
}

// TODO: refactor this component behavior
const ImageUploadPreview = ({ onFileSelect, image }: ImageUploadPreviewProps) => {
  const t = useI18n();
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [ previewUrl, setPreviewUrl ] = useState<string | null>(null);

  const imageUrl = previewUrl ?? image;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);

      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };
  return (
    <Flex
      onClick={() => uploadInputRef.current?.click()}
      fontSize="md"
      p={2}
      w="240px"
      h="240px"
      justify="center"
      textAlign="center"
      alignItems="center"
      border="1px solid #e2e8f0"
      borderRadius={'8px'}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={uploadInputRef}
      />
      {!imageUrl && (
        <Box>
          <Box as="span" display="inline-block" mb={2}>
            <FaDownload color="#CBD5E0" size={40}/>
          </Box>
          <Box>
            <Button
              variant="brand"
              mt={2}
            >{t('button.select.file')}</Button>
          </Box>
        </Box>
      )}

      {imageUrl && (
        <Box
          position={'relative'}
        >
          <Button
            border="1px solid #e2e8f0"
            boxShadow="2px 2px 4px 2px rgba(0, 0, 0, 0.12)"
            display="inline-block"
            position={'absolute'}
            bg={'white'}
            p={3}
            right={-2}
            top={-2}
            borderRadius={'25px'}
          >
            <FaPencilAlt size={15}/>
          </Button>
          <Image src={imageUrl} alt="Preview" w="216px" h="216px" objectFit={'contain'}/>
        </Box>
      )}
    </Flex>
  );
};

export default ImageUploadPreview;
