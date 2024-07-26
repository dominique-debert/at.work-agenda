export const DEFAULT_THUMBNAIL_URL =
  "https://www.serenite-residences.com/wp-content/uploads/2019/06/ondine-appartement-saint-louis-neuweg-serenite-residences-e1562140659547.jpg";

export const DEFAULT_SORT_TYPE = [
  {
    label: "Aucun",
    index: -1,
  },
  {
    label: "Date de création",
    index: 0,
  },
  {
    label: "Date de début",
    index: 1,
  },
  {
    label: "Date de fin",
    index: 2,
  },
];

export const ALL_ITEMS = { code: "all", label: "Événements à venir" };
export const ADMIN_EVENT = { code: "event", label: "Événements" };
export const ADMIN_CATEG = { code: "categ", label: "Catégories" };
export const DETAILS_EVENT = {
  code: "details",
  label: "Détail d'un événement",
};
export const VALID_EVENT = { code: "valide", label: "Événements à valider" };
export const ARCHIVE_EVENT = { code: "archive", label: "Événements archivés" };
export const ADMIN_INSCRIT = {
  code: "manage_requests",
  label: "Pré-inscriptions",
};
export const MES_INSCRIT = { code: "my", label: "Mes inscriptions" };

export const USER_SPACE = { admin: "admin", user: "user" };
//STATUS
export const APPROVED = 0;
export const PENDING = 1;
export const REJECTED = 2;
export const DRAFT = 3;

export const STATUS_REQUEST = {
  pending: "pending",
  declined: "declined",
  accepted: "accepted",
  none: "none",
};

export const NAVBAR_ITEMS = [
  {
    code: "all",
    label: "Événements a venir",
    vocab: "Events",
  },
  {
    code: "event",
    label: "Gestion des événements",
    vocab: "Events",
  },
  {
    code: "categ",
    label: "Gestion des catégories",
    vocab: "Events",
  },
  {
    code: "validate",
    label: "Validation de publication",
    vocab: "Events",
  },
  {
    code: "manage_requests",
    label: "Inscriptions",
    vocab: "Events",
  },
];

export const DETAIL_VIEW = { code: "detail", label: "Détail" };
export const INSCRIPTION_VIEW = {
  code: "inscription",
  label: "Liste des inscrits",
};

export const USER_ID = Liferay.ThemeDisplay.getUserId();
export const GROUP_ID = Liferay.ThemeDisplay.getScopeGroupId();
export const COMPANY_ID = Liferay.ThemeDisplay.getCompanyId();
export const PATH_IMAGE = Liferay.ThemeDisplay.getPathImage();
export const EVENT_PART_YES = 0;
export const EVENT_PART_MAYBE = 1;
export const EVENT_PART_NO = 2;
export const EVENT_PART_DEFAULT = -1;

export const URL = themeDisplay.getLayoutRelativeURL();
export const BASE_URL = themeDisplay.getCDNBaseURL();

export const FR_REGION = [
  { id: 0, value: "Toute la France" },
  { id: 1, value: "Auvergne-Rhône-Alpes" },
  { id: 2, value: "Bourgogne-Franche-Comté" },
  { id: 3, value: "Bretagne" },
  { id: 4, value: "Centre-Val de Loire" },
  { id: 5, value: "Corse" },
  { id: 6, value: "Grand Est" },
  { id: 7, value: "Hauts-de-France" },
  { id: 8, value: "Ile-de-France" },
  { id: 9, value: "Normandie" },
  { id: 10, value: "Nouvelle-Aquitaine" },
  { id: 11, value: "Occitanie" },
  { id: 12, value: "Pays de la Loire" },
  { id: 13, value: "Provence-Alpes-Côte d’Azur" },
];
export const FR_REGION_FILTERS = [
  { id: 0, label: "Toute la France" },
  { id: 1, label: "Auvergne-Rhône-Alpes" },
  { id: 2, label: "Bourgogne-Franche-Comté" },
  { id: 3, label: "Bretagne" },
  { id: 4, label: "Centre-Val de Loire" },
  { id: 5, label: "Corse" },
  { id: 6, label: "Grand Est" },
  { id: 7, label: "Hauts-de-France" },
  { id: 8, label: "Ile-de-France" },
  { id: 9, label: "Normandie" },
  { id: 10, label: "Nouvelle-Aquitaine" },
  { id: 11, label: "Occitanie" },
  { id: 12, label: "Pays de la Loire" },
  { id: 13, label: "Provence-Alpes-Côte d’Azur" },
];

export const SORT_TYPE = {
  create_date: "Date de création",
  start_date: "Date de début",
  end_date: "Date de fin",
};
