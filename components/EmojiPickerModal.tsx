
import React, { useState, useMemo } from 'react';
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
import { IconSymbol } from './IconSymbol';
import { emojies } from '@/constants/Colors';

interface EmojiPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  selectedEmoji: string;
}

export default function EmojiPickerModal({
  visible,
  onClose,
  onSelect,
  selectedEmoji,
}: EmojiPickerModalProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [customEmoji, setCustomEmoji] = useState('');

  // Emoji categories with names for better search
  const emojiCategories = useMemo(() => ({
    'Fruits': ['🍏 apple', '🍎 apple', '🍐 pear', '🍊 orange', '🍋 lemon', '🍌 banana', '🍉 watermelon', '🍇 grapes', '🍓 strawberry', '🫐 blueberry', '🍈 melon', '🍒 cherry', '🍑 peach', '🥭 mango', '🍍 pineapple', '🥥 coconut', '🥝 kiwi'],
    'Vegetables': ['🍅 tomato', '🍆 eggplant', '🥑 avocado', '🥦 broccoli', '🥬 lettuce', '🥒 cucumber', '🌶 pepper', '🫑 bell pepper', '🌽 corn', '🥕 carrot', '🥔 potato', '🧄 garlic', '🧅 onion', '🍄 mushroom'],
    'Food': ['🍞 bread', '🥖 baguette', '🥨 pretzel', '🥐 croissant', '🥯 bagel', '🧀 cheese', '🥚 egg', '🍳 cooking', '🥞 pancakes', '🧇 waffle', '🥓 bacon', '🥩 meat', '🍗 poultry', '🍖 meat', '🌭 hot dog', '🍔 burger', '🍟 fries', '🍕 pizza', '🥪 sandwich', '🌮 taco', '🌯 burrito', '🫔 tamale', '🥙 kebab', '🧆 falafel'],
    'Asian Food': ['🍜 noodles', '🍝 pasta', '🍣 sushi', '🍤 shrimp', '🍙 rice ball', '🍚 rice', '🍛 curry', '🍲 stew', '🥘 paella', '🥗 salad', '🍿 popcorn', '🥫 canned', '🍱 bento', '🥮 mooncake', '🍠 sweet potato', '🍥 fish cake', '🥟 dumpling', '🥠 fortune cookie', '🥡 takeout'],
    'Desserts': ['🍦 ice cream', '🍧 shaved ice', '🍨 ice cream', '🍩 donut', '🍪 cookie', '🧁 cupcake', '🍰 cake', '🎂 birthday cake', '🍮 custard', '🍭 lollipop', '🍬 candy', '🍫 chocolate', '🍯 honey'],
    'Drinks': ['🥛 milk', '🧃 juice', '🧉 mate', '🥤 soda', '🍶 sake', '🍵 tea', '🍺 beer', '🍻 beers', '🥂 champagne', '🍷 wine', '🍸 cocktail', '🍹 tropical drink', '🥃 whiskey', '🍾 champagne', '☕️ coffee', '🫖 teapot'],
    'Activities': ['🏃‍♂️ running', '🏃‍♀️ running', '🚶‍♂️ walking', '🚶‍♀️ walking', '🧘‍♂️ yoga', '🧘‍♀️ yoga', '🏋️ weightlifting', '🚴 cycling', '🏊 swimming', '⚽️ soccer', '🏀 basketball', '🏈 football', '⚾️ baseball', '🎾 tennis', '🏐 volleyball', '🏓 ping pong', '🥊 boxing', '🎯 target', '🎮 gaming', '🎲 dice', '🎸 guitar', '🎹 piano', '🎨 art', '📚 books', '✍️ writing'],
    'Health': ['💊 medicine', '💉 syringe', '🩹 bandage', '🩺 stethoscope', '💪 muscle', '🧠 brain', '🫀 heart', '🫁 lungs', '🦷 tooth', '👁 eye', '👂 ear', '👃 nose', '❤️ heart', '💔 broken heart', '💘 heart arrow', '💙 blue heart', '💚 green heart', '💛 yellow heart', '💜 purple heart'],
    'Work & Study': ['💻 laptop', '📱 phone', '⌨️ keyboard', '🖱 mouse', '🖨 printer', '📝 memo', '✏️ pencil', '✒️ pen', '📚 books', '📖 book', '📓 notebook', '📔 notebook', '📕 book', '📗 book', '📘 book', '📙 book', '📄 page', '📃 page', '📋 clipboard', '📊 chart', '📈 trending up', '📉 trending down', '💼 briefcase', '📁 folder', '📂 folder', '🗂 dividers', '📅 calendar', '📆 calendar', '🗓 calendar', '📇 card index', '🗃 file box', '🗄 file cabinet'],
    'Home': ['🏠 house', '🏡 house', '🏘 houses', '🏚 house', '🏗 construction', '🏢 office', '🏬 store', '🏪 store', '🏛 building', '⛪️ church', '🕌 mosque', '🛏 bed', '🛋 couch', '🪑 chair', '🚪 door', '🪟 window', '🚿 shower', '🛁 bathtub', '🚽 toilet', '🧻 toilet paper', '🧼 soap', '🧽 sponge', '🧹 broom', '🧺 basket', '🧴 lotion', '🪥 toothbrush', '🪒 razor', '🧯 fire extinguisher', '🔑 key', '🔒 lock', '🔓 unlock', '🔐 locked key'],
    'Transportation': ['🚗 car', '🚕 taxi', '🚙 suv', '🚌 bus', '🚎 trolleybus', '🏎 race car', '🚓 police car', '🚑 ambulance', '🚒 fire truck', '🚐 minibus', '🚚 truck', '🚛 truck', '🚜 tractor', '🛴 scooter', '🚲 bicycle', '🛵 scooter', '🏍 motorcycle', '✈️ airplane', '🚁 helicopter', '🚂 train', '🚆 train', '🚇 metro', '🚊 tram', '🚝 monorail', '🚞 mountain railway', '🚋 tram', '🚃 railway car', '🚟 railway', '🚠 cable car', '🚡 aerial tramway', '🛶 canoe', '⛵️ sailboat', '🚤 speedboat', '🛥 boat', '⛴ ferry', '🛳 ship', '🚢 ship'],
    'Nature': ['🌲 tree', '🌳 tree', '🌴 palm tree', '🌱 seedling', '🌿 herb', '☘️ shamrock', '🍀 clover', '🎋 bamboo', '🎍 pine', '🌾 rice', '🌺 hibiscus', '🌻 sunflower', '🌹 rose', '🥀 wilted', '🌷 tulip', '🌼 blossom', '🌸 cherry blossom', '💐 bouquet', '🍁 maple leaf', '🍂 fallen leaf', '🍃 leaves', '🌊 wave', '🌈 rainbow', '⭐️ star', '✨ sparkles', '⚡️ lightning', '🔥 fire', '💧 droplet', '💦 sweat', '☀️ sun', '🌤 sun cloud', '⛅️ cloud', '🌥 cloud', '☁️ cloud', '🌦 rain', '🌧 rain', '⛈ storm', '🌩 lightning', '🌨 snow', '❄️ snowflake', '☃️ snowman', '⛄️ snowman', '🌬 wind'],
    'Time & Weather': ['⏰ alarm', '⏱ stopwatch', '⏲ timer', '🕐 clock', '🕑 clock', '🕒 clock', '🕓 clock', '🕔 clock', '🕕 clock', '🕖 clock', '🕗 clock', '🕘 clock', '🕙 clock', '🕚 clock', '🕛 clock', '🌡 thermometer', '☀️ sun', '🌙 moon', '⭐️ star', '🌟 glowing star'],
    'Symbols': ['✅ check', '❌ cross', '⭕️ circle', '❓ question', '❗️ exclamation', '💯 hundred', '🎉 party', '🎊 confetti', '🎁 gift', '🏆 trophy', '🥇 gold', '🥈 silver', '🥉 bronze', '⚡️ lightning', '💡 bulb', '💰 money', '💵 dollar', '💴 yen', '💶 euro', '💷 pound', '💸 money wings', '💳 card', '🧾 receipt', '💲 dollar', '⚖️ scale', '🔔 bell', '🔕 no bell', '📢 loudspeaker', '📣 megaphone', '📯 horn', '🔊 speaker', '🔇 muted', '📻 radio', '📺 tv', '📷 camera', '📹 video', '📼 vhs', '🔍 magnifying glass', '🔎 magnifying glass', '🔬 microscope', '🔭 telescope', '📡 satellite', '🕯 candle', '💈 barber', '⚗️ alembic', '🔮 crystal ball', '🎈 balloon', '🎀 ribbon', '🎗 ribbon', '🎟 ticket', '🎫 ticket', '🏷 label', '🔖 bookmark', '📌 pin', '📍 pin', '🗺 map', '🧭 compass'],
  }), []);

  const allEmojisWithNames = useMemo(() => {
    const all: string[] = [];
    Object.values(emojiCategories).forEach(category => {
      all.push(...category);
    });
    return all;
  }, [emojiCategories]);

  const filteredEmojis = useMemo(() => {
    if (!searchQuery.trim()) {
      return allEmojisWithNames;
    }
    const query = searchQuery.toLowerCase();
    return allEmojisWithNames.filter(emojiWithName => 
      emojiWithName.toLowerCase().includes(query)
    );
  }, [searchQuery, allEmojisWithNames]);

  const handleSelect = (emojiWithName: string) => {
    const emoji = emojiWithName.split(' ')[0];
    onSelect(emoji);
    onClose();
  };

  const handleCustomEmojiAdd = () => {
    if (customEmoji.trim()) {
      // Extract just the emoji character(s)
      const emoji = customEmoji.trim();
      onSelect(emoji);
      setCustomEmoji('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.card }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Choose Icon</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" size={20} color={theme.colors.text} style={styles.searchIcon} />
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: theme.colors.text,
                },
              ]}
              placeholder="Search emojis (e.g., coffee, heart, car)..."
              placeholderTextColor={theme.dark ? '#999' : '#666'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
          </View>

          {/* Custom Emoji Input */}
          <View style={styles.customEmojiContainer}>
            <Text style={[styles.customEmojiLabel, { color: theme.colors.text }]}>
              Or paste any emoji:
            </Text>
            <View style={styles.customEmojiInputContainer}>
              <TextInput
                style={[
                  styles.customEmojiInput,
                  {
                    backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: theme.colors.text,
                  },
                ]}
                placeholder="Paste emoji here"
                placeholderTextColor={theme.dark ? '#999' : '#666'}
                value={customEmoji}
                onChangeText={setCustomEmoji}
                maxLength={10}
              />
              <Pressable
                onPress={handleCustomEmojiAdd}
                disabled={!customEmoji.trim()}
                style={[
                  styles.customEmojiButton,
                  { backgroundColor: theme.colors.primary },
                  !customEmoji.trim() && styles.customEmojiButtonDisabled,
                ]}
              >
                <Text style={styles.customEmojiButtonText}>Add</Text>
              </Pressable>
            </View>
          </View>

          {/* Emoji Grid */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.emojiGrid}>
              {filteredEmojis.map((emojiWithName, index) => {
                const emoji = emojiWithName.split(' ')[0];
                return (
                  <Pressable
                    key={`${emoji}-${index}`}
                    onPress={() => handleSelect(emojiWithName)}
                    style={[
                      styles.emojiButton,
                      selectedEmoji === emoji && styles.emojiButtonSelected,
                      {
                        backgroundColor: selectedEmoji === emoji
                          ? theme.colors.primary
                          : theme.dark
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.03)',
                      },
                    ]}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </Pressable>
                );
              })}
            </View>
            {filteredEmojis.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>
                  No emojis found. Try a different search term or paste your own emoji above.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
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
    maxHeight: '85%',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchIcon: {
    position: 'absolute',
    left: 32,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    paddingLeft: 40,
    fontSize: 16,
  },
  customEmojiContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  customEmojiLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  customEmojiInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  customEmojiInput: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 24,
    textAlign: 'center',
  },
  customEmojiButton: {
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customEmojiButtonDisabled: {
    opacity: 0.5,
  },
  customEmojiButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiButtonSelected: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  emojiText: {
    fontSize: 32,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
});
