<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class salle_diponible extends Model
{
    use HasFactory;
    protected $table = 'salle_diponible';
    protected $fillable = [
        'salle_id',
        'id_filiere',
        'id_sujjets',
        'id_enseignements',
        'jour',
        'hour_debut',
        'hour_fin',
        'disponible',
        'id_classe'
    ];

    // Relation vers salle
    public function salle()
    {
        return $this->belongsTo(Salle::class, 'salle_id');
    }

    // Relation vers filiere
    public function filiere()
    {
        return $this->belongsTo(filieres::class, 'id_filiere');
    }

    // Relation vers sujjets
    public function sujjets()
    {
        return $this->belongsTo(Sujjet::class, 'id_sujjets');
    }

    // Relation vers enseignements
    public function enseignement()
    {
        return $this->belongsTo(Enseignement::class, 'id_enseignements');
    }
    public function classe()
    {
        return $this->belongsTo(Classe::class, 'id_classe');
    }
}