// app/actions/boardActions.js
"use client";

// Get all boards from localStorage
export const getBoards = () => {
  if (typeof window !== "undefined") {
    const boards = localStorage.getItem("boards");
    return boards ? JSON.parse(boards) : [];
  }
  return [];
};

// Save boards to localStorage
const saveBoards = (boards) => {
  localStorage.setItem("boards", JSON.stringify(boards));
};

function generateRandomId(length) {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Create a new board
export const createBoard = (boardName, boardSlug) => {
  try {
    const boards = getBoards();

    // Check if board with slug already exists
    if (boards.some((board) => board.slug === boardSlug)) {
      return {
        success: false,
        error: "A board with this name already exists",
      };
    }

    const id = generateRandomId(16);

    const newBoard = {
      id,
      name: boardName,
      slug: boardSlug,
      lists: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    boards.push(newBoard);
    saveBoards(boards);

    return { success: true, board: newBoard };
  } catch (error) {
    console.error("Error creating board:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Create a new list
export const createList = (boardId, title, maxCards = null) => {
  try {
    const boards = getBoards();
    const boardIndex = boards.findIndex((b) => b.id === boardId);

    if (boardIndex === -1) {
      return {
        success: false,
        error: "Board not found",
      };
    }

    const newList = {
      id: Date.now(),
      title,
      maxCards: maxCards ? parseInt(maxCards) : null,
      cards: [],
      position: boards[boardIndex].lists.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    boards[boardIndex].lists.push(newList);
    boards[boardIndex].updatedAt = new Date().toISOString();
    saveBoards(boards);

    return { success: true, list: newList };
  } catch (error) {
    console.error("Error creating list:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Create a new card
export const createCard = (listId, title) => {
  try {
    const boards = getBoards();

    // Find the board and list
    let boardIndex = -1;
    let listIndex = -1;

    for (let i = 0; i < boards.length; i++) {
      const board = boards[i];

      if (!board.lists) board.lists = [];

      const lIndex = board.lists?.findIndex((list) => list.id === listId);
      if (lIndex !== -1) {
        boardIndex = i;
        listIndex = lIndex;
        break;
      }
    }

    if (boardIndex === -1 || listIndex === -1) {
      return {
        success: false,
        error: "List not found",
      };
    }

    const targetList = boards[boardIndex].lists?.[listIndex];
    if (!targetList.cards) targetList.cards = [];

    // Check if adding a new card would exceed maxCards
    if (targetList.maxCards && targetList.cards.length >= targetList.maxCards) {
      return {
        success: false,
        error: "Maximum number of cards reached",
      };
    }

    const newCard = {
      id: Date.now(),
      title,
      position: targetList.cards.length,
      reactions: {}, // Add this line
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    targetList.cards.push(newCard);
    targetList.updatedAt = new Date().toISOString();
    boards[boardIndex].updatedAt = new Date().toISOString();
    saveBoards(boards);

    return { success: true, card: newCard };
  } catch (error) {
    console.error("Error creating card:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get a board by its slug
export const getBoardBySlug = (slug) => {
  const boards = getBoards();
  const board = boards.find((board) => board.slug === slug);

  if (!board) {
    return null;
  }

  // Ensure lists are sorted by position
  board.lists = (board.lists || []).sort((a, b) => a.position - b.position);

  // Ensure cards in each list are sorted by position
  board.lists.forEach((list) => {
    list.cards = (list.cards || []).sort((a, b) => a.position - b.position);
  });

  return board;
};

// Delete a list
export const deleteList = (boardId, listId) => {
  try {
    const boards = getBoards();
    const boardIndex = boards.findIndex((b) => b.id === boardId);

    if (boardIndex === -1) {
      return {
        success: false,
        error: "Board not found",
      };
    }

    const listIndex = boards[boardIndex].lists.findIndex(
      (l) => l.id === listId
    );

    if (listIndex === -1) {
      return {
        success: false,
        error: "List not found",
      };
    }

    // Remove the list
    boards[boardIndex].lists.splice(listIndex, 1);

    // Update positions for remaining lists
    boards[boardIndex].lists.forEach((list, index) => {
      list.position = index;
    });

    boards[boardIndex].updatedAt = new Date().toISOString();
    saveBoards(boards);

    return { success: true };
  } catch (error) {
    console.error("Error deleting list:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete a card
export const deleteCard = (listId, cardId) => {
  try {
    const boards = getBoards();

    // Find the board and list
    let boardIndex = -1;
    let listIndex = -1;

    for (let i = 0; i < boards.length; i++) {
      const board = boards[i];
      const lIndex = board.lists?.findIndex((list) => list.id === listId);
      if (lIndex !== -1) {
        boardIndex = i;
        listIndex = lIndex;
        break;
      }
    }

    if (boardIndex === -1 || listIndex === -1) {
      return {
        success: false,
        error: "List not found",
      };
    }

    const targetList = boards[boardIndex].lists[listIndex];
    const cardIndex = targetList.cards.findIndex((card) => card.id === cardId);

    if (cardIndex === -1) {
      return {
        success: false,
        error: "Card not found",
      };
    }

    // Remove the card
    targetList.cards.splice(cardIndex, 1);

    // Update positions for remaining cards
    targetList.cards.forEach((card, index) => {
      card.position = index;
    });

    targetList.updatedAt = new Date().toISOString();
    boards[boardIndex].updatedAt = new Date().toISOString();
    saveBoards(boards);

    return { success: true };
  } catch (error) {
    console.error("Error deleting card:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
