
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { backgroundColors } from '@/constants/Colors';
import { IconSymbol } from './IconSymbol';
import EmojiPickerModal from './EmojiPickerModal';

interface AddTileModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (text: string, emoji: string, color: string) => void;
}

export default function AddTileModal({ visible, onClose, onAdd }: AddTileModalProps) {
  const theme = useTheme();
  const [text, setText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📝');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text.trim(), selectedEmoji, selectedColor);
      setText('');
      setSelectedEmoji('📝');
      setSelectedColor('#3b82f6');
      onClose();
    }
  };

  const handleClose = () => {
    setText('');
    setSelectedEmoji('📝');
    setSelectedColor('#3b82f6');
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.card }]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.text }]}>Create New Tile</Text>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <IconSymbol name="xmark" size={24} color={theme.colors.text} />
              </Pressable>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Text Input */}
              <View style={styles.section}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Tile Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      color: theme.colors.text,
                      borderColor: theme.dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    },
                  ]}
                  placeholder="e.g., Drank Water"
                  placeholderTextColor={theme.dark ? '#999' : '#666'}
                  value={text}
                  onChangeText={setText}
                  maxLength={30}
                  autoFocus
                />
              </View>

              {/* Emoji Picker Button */}
              <View style={styles.section}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Choose Icon</Text>
                <Pressable
                  onPress={() => setShowEmojiPicker(true)}
                  style={[
                    styles.emojiPickerButton,
                    {
                      backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      borderColor: theme.dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    },
                  ]}
                >
                  <Text style={styles.selectedEmojiLarge}>{selectedEmoji}</Text>
                  <View style={styles.emojiPickerButtonText}>
                    <Text style={[styles.emojiPickerButtonLabel, { color: theme.colors.text }]}>
                      Tap to change icon
                    </Text>
                    <Text style={[styles.emojiPickerButtonHint, { color: theme.colors.text, opacity: 0.6 }]}>
                      Search from hundreds of emojis
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={theme.colors.text} style={{ opacity: 0.5 }} />
                </Pressable>
              </View>

              {/* Color Picker */}
              <View style={styles.section}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Choose Color</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.colorGrid}>
                    {backgroundColors.slice(0, 60).map((color) => (
                      <Pressable
                        key={color}
                        onPress={() => setSelectedColor(color)}
                        style={[
                          styles.colorButton,
                          { backgroundColor: color },
                          selectedColor === color && styles.colorButtonSelected,
                        ]}
                      >
                        {selectedColor === color && (
                          <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                        )}
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Preview */}
              <View style={styles.section}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Preview</Text>
                <View style={[styles.preview, { backgroundColor: selectedColor }]}>
                  <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
                  <Text style={styles.previewText}>{text || 'Tile Name'}</Text>
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <Pressable
                onPress={handleClose}
                style={[
                  styles.button,
                  styles.cancelButton,
                  { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                ]}
              >
                <Text style={[styles.buttonText, { color: theme.colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleAdd}
                disabled={!text.trim()}
                style={[
                  styles.button,
                  styles.addButton,
                  { backgroundColor: theme.colors.primary },
                  !text.trim() && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.addButtonText}>Create Tile</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Emoji Picker Modal */}
      <EmojiPickerModal
        visible={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSelect={setSelectedEmoji}
        selectedEmoji={selectedEmoji}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  emojiPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  selectedEmojiLarge: {
    fontSize: 40,
  },
  emojiPickerButtonText: {
    flex: 1,
  },
  emojiPickerButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  emojiPickerButtonHint: {
    fontSize: 13,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorButtonSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  preview: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  previewEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    // backgroundColor handled dynamically
  },
  addButton: {
    // backgroundColor handled dynamically
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
